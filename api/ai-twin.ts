import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
// NOTE: keep this import RELATIVE. The `@` alias is a Vite (frontend) alias;
// Vercel bundles /api functions separately and cannot resolve it.
import { buildSystemPrompt } from '../src/server/aiTwinPrompt';

/**
 * AI Twin backend — Vercel serverless function.
 *
 * Request:  POST { messages: [{ role: 'user' | 'assistant', content: string }], locale?: string }
 * Response: 200 { reply: string } | 429 { error: 'rate_limited' } | 4xx/5xx { error: string }
 *
 * Free-tier protection (three layers):
 * 1. Hard caps per request: history and message length are trimmed, small
 *    max_tokens, cheapest model (Haiku).
 * 2. Per-IP rate limit: 8 requests/minute and 40/day. Uses Upstash Redis
 *    (fixed windows) when UPSTASH_REDIS_REST_URL/TOKEN are set — survives
 *    cold starts; otherwise falls back to in-memory (per warm instance).
 * 3. Same-origin check to keep other sites from embedding the endpoint.
 */

// --- Caps ----------------------------------------------------------------------
const MAX_HISTORY_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 800;
const MAX_TOKENS = 400;
const MODEL = 'claude-haiku-4-5-20251001';

const LIMIT_PER_MINUTE = 8;
const LIMIT_PER_DAY = 40;

// --- Rate limiting ---------------------------------------------------------------

/** In-memory fallback: ip -> request timestamps (ms). Reset on cold start. */
const memoryHits = new Map<string, number[]>();

function memoryLimit(ip: string): boolean {
  const now = Date.now();
  const dayAgo = now - 86_400_000;
  const minuteAgo = now - 60_000;

  const hits = (memoryHits.get(ip) ?? []).filter((t) => t > dayAgo);
  const lastMinute = hits.filter((t) => t > minuteAgo).length;

  if (lastMinute >= LIMIT_PER_MINUTE || hits.length >= LIMIT_PER_DAY) return false;

  hits.push(now);
  memoryHits.set(ip, hits);
  return true;
}

/** Upstash REST fixed-window counters. Returns null when not configured. */
async function upstashLimit(ip: string): Promise<boolean | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const minuteKey = `aitwin:m:${ip}:${Math.floor(Date.now() / 60_000)}`;
  const dayKey = `aitwin:d:${ip}:${Math.floor(Date.now() / 86_400_000)}`;

  const response = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([
      ['INCR', minuteKey],
      ['EXPIRE', minuteKey, '90'],
      ['INCR', dayKey],
      ['EXPIRE', dayKey, '90000'],
    ]),
  });

  if (!response.ok) return null; // Redis down — fail open to memory limiter

  const results = (await response.json()) as Array<{ result: number }>;
  const perMinute = results[0]?.result ?? 0;
  const perDay = results[2]?.result ?? 0;
  return perMinute <= LIMIT_PER_MINUTE && perDay <= LIMIT_PER_DAY;
}

async function isAllowed(ip: string): Promise<boolean> {
  const upstash = await upstashLimit(ip);
  return upstash !== null ? upstash : memoryLimit(ip);
}

// --- Validation -------------------------------------------------------------------

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

function parseMessages(body: unknown): IncomingMessage[] | null {
  if (typeof body !== 'object' || body === null) return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const messages: IncomingMessage[] = [];
  for (const item of raw) {
    const role = (item as IncomingMessage)?.role;
    const content = (item as IncomingMessage)?.content;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null;
    messages.push({ role, content: content.slice(0, MAX_MESSAGE_LENGTH) });
  }

  // Anthropic requires the conversation to end with a user message
  const trimmed = messages.slice(-MAX_HISTORY_MESSAGES);
  if (trimmed[trimmed.length - 1]?.role !== 'user') return null;
  // ...and to start with one
  while (trimmed.length > 0 && trimmed[0].role !== 'user') trimmed.shift();

  return trimmed.length > 0 ? trimmed : null;
}

// --- Handler -----------------------------------------------------------------------

const anthropic = new Anthropic(); // ANTHROPIC_API_KEY from env
const SYSTEM_PROMPT = buildSystemPrompt();

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  // Same-origin check (best-effort; blocks casual abuse from other sites)
  const origin = req.headers.origin ?? '';
  const allowedOrigins = (process.env.AI_TWIN_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (allowedOrigins.length > 0 && origin && !allowedOrigins.includes(origin)) {
    res.status(403).json({ error: 'forbidden' });
    return;
  }

  const ip =
    (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ?? 'unknown';

  if (!(await isAllowed(ip))) {
    res.status(429).json({ error: 'rate_limited' });
    return;
  }

  const messages = parseMessages(req.body);
  if (!messages) {
    res.status(400).json({ error: 'invalid_request' });
    return;
  }

  try {
    const completion = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages,
    });

    const reply = completion.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('');

    res.status(200).json({ reply });
  } catch (error) {
    console.error('[ai-twin] Anthropic request failed:', error);
    res.status(502).json({ error: 'upstream_error' });
  }
}

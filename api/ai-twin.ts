import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
// NOTE: relative import WITH the .js extension — package.json sets
// "type": "module", so the deployed function runs as native ESM and Node
// refuses extensionless specifiers (ERR_MODULE_NOT_FOUND).
import { buildSystemPrompt } from './_utils/aiTwinPrompt.js';

/**
 * AI Twin backend — Vercel function. POST { messages, locale? } → 200 { reply } | 429 { error: 'rate_limited' }.
 * Free-tier protection: hard per-request caps (trimmed history/length, small max_tokens, Haiku),
 * per-IP limits (8/min, 40/day) via Upstash fixed windows or in-memory fallback, same-origin check.
 */

// --- Caps ----------------------------------------------------------------------
const MAX_HISTORY_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 800;
const MAX_TOKENS = 256;
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

// Lazy client: `new Anthropic()` without a key throws, and doing that at
// module level would kill the whole function with an opaque 500
let anthropic: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  anthropic ??= new Anthropic();
  return anthropic;
}

const SYSTEM_PROMPT = buildSystemPrompt();

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const client = getClient();
  if (!client) {
    console.error('[ai-twin] ANTHROPIC_API_KEY is not set for this environment');
    res.status(500).json({ error: 'missing_api_key' });
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
    const completion = await createWithRetry(client, messages);

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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Anthropic call with prompt caching + retry on transient failures.
 *
 * - The system prompt (the whole resume) is large and constant, so we mark it
 *   with cache_control: 'ephemeral' — Anthropic caches it and bills cached
 *   input tokens at ~10% on subsequent calls, a big cost cut.
 * - 429 / 5xx / overloaded errors are retried up to 2 times with backoff.
 */
async function createWithRetry(
  client: Anthropic,
  messages: IncomingMessage[],
): Promise<Anthropic.Message> {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
        messages,
      });
    } catch (error) {
      const status = (error as { status?: number }).status;
      const retriable = status === 429 || status === 529 || (status !== undefined && status >= 500);
      if (!retriable || attempt === maxAttempts) throw error;
      await sleep(300 * 2 ** (attempt - 1)); // 300ms, 600ms
    }
  }

  // Unreachable: the loop either returns or throws
  throw new Error('unreachable');
}

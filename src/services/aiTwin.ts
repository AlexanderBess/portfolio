import i18n from '@/i18n';

/**
 * AI Twin chat service.
 *
 * Provider architecture:
 * - `mockProvider` (default) — pure client-side: intent matching over the
 *   user's text + localized canned answers, with simulated network latency.
 * - `httpProvider` — real backend. Enabled by setting VITE_AI_TWIN_ENDPOINT
 *   (e.g. `/api/ai-twin` for a Vercel serverless function). The endpoint
 *   receives `{ messages, locale }` and must respond `{ reply: string }`.
 *
 * The UI depends only on the `AiTwinProvider` interface, so swapping the
 * mock for a real LLM backend requires zero component changes.
 */

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: number;
  role: ChatRole;
  text: string;
}

export interface AiTwinProvider {
  send(history: ChatMessage[], userText: string): Promise<string>;
}

/** Thrown by the HTTP provider on 429 so the UI can show a friendly message. */
export class AiTwinRateLimitError extends Error {
  constructor() {
    super('AI twin rate limit reached');
    this.name = 'AiTwinRateLimitError';
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- Mock provider -----------------------------------------------------------

type MockIntent = 'skills' | 'emcd' | 'hobby';

/** Order matters: first match wins. Keywords cover both locales. */
const INTENTS: ReadonlyArray<{ intent: MockIntent; pattern: RegExp }> = [
  { intent: 'emcd', pattern: /emcd|p2p|маркетплейс|marketplace|крипт|crypto/i },
  { intent: 'skills', pattern: /vue|react|nuxt|next|typescript|навык|скилл|skill|стек|stack|опыт|experience/i },
  { intent: 'hobby', pattern: /хобби|hobby|интерес|interest|фото|photo|игр|gam(e|ing)|путешеств|travel/i },
];

const mockProvider: AiTwinProvider = {
  async send(_history, userText) {
    // Simulated "thinking" latency so the typing indicator is visible
    await sleep(800 + Math.random() * 800);

    const match = INTENTS.find(({ pattern }) => pattern.test(userText));
    const key = match ? `aiTwin.answers.${match.intent}` : 'aiTwin.answers.fallback';
    return i18n.global.t(key);
  },
};

// --- HTTP provider -----------------------------------------------------------

function createHttpProvider(endpoint: string): AiTwinProvider {
  return {
    async send(history, _userText) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(({ role, text }) => ({ role, content: text })),
          locale: i18n.global.locale.value,
        }),
      });

      if (response.status === 429) {
        throw new AiTwinRateLimitError();
      }
      if (!response.ok) {
        throw new Error(`AI twin endpoint responded with ${response.status}`);
      }

      const data = (await response.json()) as { reply: string };
      return data.reply;
    },
  };
}

// --- Export ------------------------------------------------------------------

const endpoint = import.meta.env.VITE_AI_TWIN_ENDPOINT;

export const aiTwinService: AiTwinProvider = endpoint
  ? createHttpProvider(endpoint)
  : mockProvider;

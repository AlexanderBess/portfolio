import i18n from '@/i18n';

/**
 * AI Twin chat service: client-side mock provider by default, HTTP provider
 * when VITE_AI_TWIN_ENDPOINT is set (e.g. `/api/ai-twin`).
 * Endpoint contract: POST `{ messages, locale }` → `{ reply: string }`.
 */

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: number;
  role: ChatRole;
  text: string;
  /** Set on an assistant message when the request failed — enables Retry. */
  error?: boolean;
  /** Set on an assistant message that answers a CV/resume request — shows a Download CV button. */
  cvRequested?: boolean;
}

/**
 * Matches a visitor asking for the CV/resume, in either language. Shared by
 * the mock provider (to pick the `cv` intent) and the chat composable (to
 * decide whether to show the Download CV button under the reply — this
 * matters for the HTTP provider too, since the real model's wording isn't
 * guaranteed to be detectable after the fact).
 */
export const CV_REQUEST_PATTERN = /резюме|resume|\bcv\b/i;

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

type MockIntent = 'skills' | 'emcd' | 'hobby' | 'projects' | 'experience' | 'contacts' | 'cv';

/** Order matters: first match wins. Keywords cover both locales. */
const INTENTS: ReadonlyArray<{ intent: MockIntent; pattern: RegExp }> = [
  { intent: 'cv', pattern: CV_REQUEST_PATTERN },
  { intent: 'emcd', pattern: /emcd|p2p|маркетплейс|marketplace|крипт|crypto/i },
  { intent: 'projects', pattern: /проект|project|портфолио|portfolio/i },
  { intent: 'experience', pattern: /опыт|experience|карьер|career|компан|работал/i },
  { intent: 'contacts', pattern: /контакт|contact|связ|reach|почт|email|telegram|нанять|hire/i },
  { intent: 'skills', pattern: /vue|react|nuxt|next|typescript|навык|скилл|skill|стек|stack/i },
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

import { readonly, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { aiTwinService, AiTwinRateLimitError, type ChatMessage } from '@/services/aiTwin';

const STORAGE_KEY = 'ai-twin-chat';
const MAX_PERSISTED = 30;

let messageId = 0;

// Module-scoped: the FAB widget and the fullscreen chat share one history.
const messages = ref<ChatMessage[]>([]);
const isTyping = ref(false);
const isLoadingHistory = ref(false);

// Restore a previous conversation (survives reload / mode switch)
restore();

function restore(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(saved) || saved.length === 0) return;
    messages.value = saved;
    messageId = saved.reduce((max, m) => Math.max(max, m.id), 0);
  } catch {
    // Corrupt storage — start fresh, nothing to do
  }
}

// Persist on every change (capped so storage can't grow unbounded)
watch(
  messages,
  (list) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-MAX_PERSISTED)));
    } catch {
      // Storage full / unavailable — non-fatal
    }
  },
  { deep: true },
);

/** Chat state for the AI twin; transport-agnostic — all backend I/O goes through `aiTwinService`. */
export function useAiTwinChat() {
  const { t } = useI18n();

  function push(role: ChatMessage['role'], text: string, error = false): void {
    messages.value.push({ id: ++messageId, role, text, error });
  }

  /** First open: brief skeleton phase, then the localized greeting. */
  async function init(): Promise<void> {
    if (messages.value.length > 0 || isLoadingHistory.value) return;

    isLoadingHistory.value = true;
    await new Promise((resolve) => setTimeout(resolve, 700));
    isLoadingHistory.value = false;

    push('assistant', t('aiTwin.greeting'));
  }

  /** Core send: `history` is what the model sees; `display` is the shown text. */
  async function ask(): Promise<void> {
    isTyping.value = true;
    try {
      const userText = [...messages.value].reverse().find((m) => m.role === 'user')?.text ?? '';
      const reply = await aiTwinService.send(messages.value, userText);
      push('assistant', reply);
    } catch (error) {
      const key =
        error instanceof AiTwinRateLimitError ? 'aiTwin.answers.rateLimited' : 'aiTwin.answers.error';
      push('assistant', t(key), true);
    } finally {
      isTyping.value = false;
    }
  }

  async function send(text: string): Promise<void> {
    const trimmed = text.trim();
    if (!trimmed || isTyping.value) return;
    push('user', trimmed);
    await ask();
  }

  /** Re-run the last request after a failed assistant reply. */
  async function retry(): Promise<void> {
    if (isTyping.value) return;
    const last = messages.value[messages.value.length - 1];
    if (!last?.error) return;
    messages.value.pop(); // drop the error bubble
    await ask();
  }

  /** Wipe the conversation and re-seed the greeting. */
  async function clear(): Promise<void> {
    messages.value = [];
    messageId = 0;
    await init();
  }

  return {
    messages: readonly(messages),
    isTyping: readonly(isTyping),
    isLoadingHistory: readonly(isLoadingHistory),
    init,
    send,
    retry,
    clear,
  };
}

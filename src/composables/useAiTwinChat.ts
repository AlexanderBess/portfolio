import { readonly, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { aiTwinService, AiTwinRateLimitError, type ChatMessage } from '@/services/aiTwin';

let messageId = 0;

/** Chat state for the AI Twin widget; transport-agnostic — all backend I/O goes through `aiTwinService`. */
export function useAiTwinChat() {
  const { t } = useI18n();

  const messages = ref<ChatMessage[]>([]);
  const isTyping = ref(false);
  const isLoadingHistory = ref(false);

  function push(role: ChatMessage['role'], text: string): void {
    messages.value.push({ id: ++messageId, role, text });
  }

  /** First open: brief skeleton phase, then the localized greeting. */
  async function init(): Promise<void> {
    if (messages.value.length > 0 || isLoadingHistory.value) return;

    isLoadingHistory.value = true;
    await new Promise((resolve) => setTimeout(resolve, 700));
    isLoadingHistory.value = false;

    push('assistant', t('aiTwin.greeting'));
  }

  async function send(text: string): Promise<void> {
    const trimmed = text.trim();
    if (!trimmed || isTyping.value) return;

    push('user', trimmed);
    isTyping.value = true;

    try {
      const reply = await aiTwinService.send(messages.value, trimmed);
      push('assistant', reply);
    } catch (error) {
      const key =
        error instanceof AiTwinRateLimitError ? 'aiTwin.answers.rateLimited' : 'aiTwin.answers.error';
      push('assistant', t(key));
    } finally {
      isTyping.value = false;
    }
  }

  return {
    messages: readonly(messages),
    isTyping: readonly(isTyping),
    isLoadingHistory: readonly(isLoadingHistory),
    init,
    send,
  };
}

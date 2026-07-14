<template>
  <!-- ═══ Floating action button ═══ -->
  <button
    class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition-colors hover:bg-primary-700"
    :aria-label="isOpen ? t('aiTwin.closeChat') : t('aiTwin.openChat')"
    :aria-expanded="isOpen"
    @click="toggle"
  >
    <span
      v-if="!hasBeenOpened"
      class="absolute inset-0 rounded-full bg-primary-500/50 motion-safe:animate-ping"
      aria-hidden="true"
    />
    <Transition name="fab-icon" mode="out-in">
      <X v-if="isOpen" class="h-6 w-6" />
      <Bot v-else class="h-6 w-6" />
    </Transition>
  </button>

  <!-- ═══ Chat window ═══ -->
  <Transition name="chat-pop">
    <div
      v-if="isOpen"
      class="chat-window fixed bottom-24 right-6 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-theme-border text-theme-text shadow-2xl"
      role="dialog"
      :aria-label="t('aiTwin.title')"
      @keydown.esc="toggle"
    >
      <!-- Header -->
      <header class="flex items-center gap-3 border-b border-theme-border px-4 py-3">
        <div class="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary-600/15">
          <Bot class="h-5 w-5 text-primary-500" />
          <span class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-theme-card bg-emerald-500" />
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold">{{ t('aiTwin.title') }}</p>
          <p class="truncate text-xs text-theme-muted">{{ t('aiTwin.subtitle') }}</p>
        </div>
      </header>

      <!-- Messages -->
      <div ref="scrollAreaRef" class="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        <!-- Skeletons while "loading history" -->
        <template v-if="isLoadingHistory">
          <div class="w-3/4 space-y-2 rounded-2xl rounded-bl-md border border-theme-border bg-theme-chip p-3.5">
            <div class="h-3 w-full animate-pulse rounded bg-theme-border" />
            <div class="h-3 w-2/3 animate-pulse rounded bg-theme-border" />
          </div>
        </template>

        <TransitionGroup name="msg">
          <div
            v-for="message in messages"
            :key="message.id"
            class="flex"
            :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <p
              class="max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
              :class="
                message.role === 'user'
                  ? 'rounded-br-md bg-primary-600 text-white'
                  : 'rounded-bl-md border border-theme-border bg-theme-chip'
              "
            >
              {{ message.text }}
            </p>
          </div>
        </TransitionGroup>

        <!-- Typing indicator -->
        <div v-if="isTyping" class="flex justify-start" :aria-label="t('aiTwin.typing')">
          <div class="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-theme-border bg-theme-chip px-4 py-3">
            <span class="typing-dot" />
            <span class="typing-dot" style="animation-delay: 0.15s" />
            <span class="typing-dot" style="animation-delay: 0.3s" />
          </div>
        </div>
      </div>

      <!-- Quick questions -->
      <div v-if="showQuickQuestions" class="flex flex-wrap gap-2 px-4 pb-3">
        <button
          v-for="question in quickQuestions"
          :key="question"
          class="rounded-xl border border-theme-border bg-theme-chip px-3 py-1.5 text-left text-xs text-theme-muted transition-colors hover:border-theme-border-hover hover:text-theme-text"
          @click="send(question)"
        >
          {{ question }}
        </button>
      </div>

      <!-- Input -->
      <form class="flex items-center gap-2 border-t border-theme-border p-3" @submit.prevent="onSubmit">
        <input
          ref="inputRef"
          v-model="draft"
          type="text"
          :placeholder="t('aiTwin.placeholder')"
          :aria-label="t('aiTwin.placeholder')"
          class="min-w-0 flex-1 rounded-xl border border-theme-border bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-theme-muted focus:border-primary-500"
        />
        <button
          type="submit"
          :disabled="!draft.trim() || isTyping"
          :aria-label="t('aiTwin.send')"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SendHorizontal class="h-4 w-4" />
        </button>
      </form>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Bot, SendHorizontal, X } from 'lucide-vue-next'
import { useAiTwinChat } from '@/composables/useAiTwinChat'

const { t } = useI18n()
const { messages, isTyping, isLoadingHistory, init, send } = useAiTwinChat()

const isOpen = ref(false)
const hasBeenOpened = ref(false)
const draft = ref('')

const scrollAreaRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const quickQuestions = computed(() => [
  t('aiTwin.quick.skills'),
  t('aiTwin.quick.emcd'),
  t('aiTwin.quick.hobby'),
])

/** Chips are shown until the visitor asks their first question. */
const showQuickQuestions = computed(
  () => !isLoadingHistory.value && !messages.value.some((m) => m.role === 'user'),
)

function toggle(): void {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    hasBeenOpened.value = true
    void init()
    void nextTick(() => inputRef.value?.focus())
  }
}

function onSubmit(): void {
  void send(draft.value)
  draft.value = ''
}

function scrollToBottom(): void {
  void nextTick(() => {
    scrollAreaRef.value?.scrollTo({ top: scrollAreaRef.value.scrollHeight, behavior: 'smooth' })
  })
}

watch([() => messages.value.length, isTyping, isLoadingHistory], scrollToBottom)
</script>

<style scoped>
/*
 * Opaque, theme-aware background set directly on the CSS var — deliberately
 * not a Tailwind utility, so the overlay never turns transparent because of
 * config/JIT issues.
 */
.chat-window {
  background-color: var(--card-bg);
}

/* Window pop-in/out */
.chat-pop-enter-active,
.chat-pop-leave-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: bottom right;
}

.chat-pop-enter-from,
.chat-pop-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
}

/* FAB icon swap */
.fab-icon-enter-active,
.fab-icon-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}

.fab-icon-enter-from,
.fab-icon-leave-to {
  opacity: 0;
  transform: rotate(45deg) scale(0.6);
}

/* Message appear */
.msg-enter-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.msg-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

/* Typing indicator dots */
.typing-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-secondary);
  animation: typing-bounce 1s ease-in-out infinite;
}

@keyframes typing-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .typing-dot {
    animation: none;
  }
}
</style>

<template>
  <section class="flex h-dvh flex-col pt-20 text-theme-text" :aria-label="t('aiTwin.title')">
    <!-- ═══ Empty state: gradient greeting + suggestion cards ═══ -->
    <div v-if="isEmptyState" class="flex flex-1 flex-col items-center justify-center gap-8 overflow-y-auto px-4 pb-8">
      <div class="text-center">
        <h1 class="gradient-text text-4xl font-bold leading-tight sm:text-5xl">
          {{ t('aiTwin.fullscreen.greeting') }}
        </h1>
        <p class="mx-auto mt-4 max-w-md text-sm leading-relaxed text-theme-muted sm:text-base">
          {{ t('aiTwin.fullscreen.subtitle') }}
        </p>
      </div>

      <div class="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          v-for="suggestion in suggestions"
          :key="suggestion.id"
          class="group flex items-center gap-3 rounded-2xl border border-theme-border bg-theme-card p-4 text-left transition-colors hover:border-theme-border-hover"
          @click="send(t(`aiTwin.fullscreen.suggestions.${suggestion.id}.prompt`))"
        >
          <component :is="suggestion.icon" class="h-5 w-5 shrink-0 text-primary-500" aria-hidden="true" />
          <span class="text-sm text-theme-muted transition-colors group-hover:text-theme-text">
            {{ t(`aiTwin.fullscreen.suggestions.${suggestion.id}.title`) }}
          </span>
        </button>
      </div>
    </div>

    <!-- ═══ Dialog state: centered message feed ═══ -->
    <div v-else ref="scrollAreaRef" class="flex-1 overflow-y-auto px-4" aria-live="polite">
      <div class="mx-auto flex w-full max-w-2xl flex-col gap-4 py-6">
        <TransitionGroup name="msg">
          <div
            v-for="message in messages"
            :key="message.id"
            class="flex"
            :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div v-if="message.role === 'assistant'" class="flex max-w-[90%] gap-3">
              <span class="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600/15">
                <Bot class="h-5 w-5 text-primary-500" aria-hidden="true" />
              </span>
              <p
                class="assistant-bubble whitespace-pre-line rounded-2xl rounded-tl-md border border-theme-border px-4 py-2.5 text-sm leading-relaxed sm:text-base"
                v-html="formatMessage(message.text)"
              />
            </div>
            <div v-else class="flex max-w-[85%] flex-row-reverse gap-3">
              <img
                :src="userAvatarUrl"
                alt=""
                width="56"
                height="56"
                loading="lazy"
                decoding="async"
                class="mt-1 h-9 w-9 shrink-0 rounded-full border border-theme-border object-cover"
              />
              <p class="whitespace-pre-line rounded-2xl rounded-tr-md bg-primary-600 px-4 py-2.5 text-sm leading-relaxed text-white sm:text-base">
                {{ message.text }}
              </p>
            </div>
          </div>
        </TransitionGroup>

        <div v-if="isTyping" class="flex gap-3" :aria-label="t('aiTwin.typing')">
          <span class="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600/15">
            <Bot class="h-5 w-5 text-primary-500" aria-hidden="true" />
          </span>
          <span class="assistant-bubble flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-theme-border px-4 py-3">
            <span class="typing-dot" />
            <span class="typing-dot" style="animation-delay: 0.15s" />
            <span class="typing-dot" style="animation-delay: 0.3s" />
          </span>
        </div>
      </div>
    </div>

    <!-- ═══ Floating input ═══ -->
    <div class="px-4 pb-4 sm:pb-6">
      <form
        class="chat-input mx-auto flex w-full max-w-2xl items-end gap-2 rounded-3xl border border-theme-border p-2 shadow-lg transition-all focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/25"
        @submit.prevent="onSubmit"
      >
        <textarea
          ref="textareaRef"
          v-model="draft"
          rows="1"
          :placeholder="t('aiTwin.placeholder')"
          :aria-label="t('aiTwin.placeholder')"
          class="max-h-40 min-w-0 flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-relaxed outline-none placeholder:text-theme-muted sm:text-base"
          @input="autosize"
          @keydown.enter.exact.prevent="onSubmit"
        />
        <button
          type="submit"
          :disabled="!draft.trim() || isTyping"
          :aria-label="t('aiTwin.send')"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowUp class="h-5 w-5" aria-hidden="true" />
        </button>
      </form>
      <p class="mt-2 text-center text-xs text-theme-muted opacity-70">
        {{ t('aiTwin.fullscreen.hint') }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowUp, Bot, Briefcase, FolderGit2, Layers, Mail } from 'lucide-vue-next'
import { useAiTwinChat } from '@/composables/useAiTwinChat'
import { formatMessage } from '@/utils/formatMessage'
// Imported so Vite bundles the asset — raw /src/... paths 404 in production
import userAvatarUrl from '@/assets/images/PNG/user_avatar.jpg'

const { t } = useI18n()
const { messages, isTyping, send } = useAiTwinChat()

const draft = ref('')
const scrollAreaRef = ref<HTMLDivElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

/** Suggestion cards until the visitor sends their first message. */
const isEmptyState = computed(() => !messages.value.some((m) => m.role === 'user'))

interface Suggestion {
  id: 'projects' | 'stack' | 'experience' | 'contacts'
  icon: Component
}

const suggestions: Suggestion[] = [
  { id: 'projects', icon: FolderGit2 },
  { id: 'stack', icon: Layers },
  { id: 'experience', icon: Briefcase },
  { id: 'contacts', icon: Mail },
]

function onSubmit(): void {
  void send(draft.value)
  draft.value = ''
  void nextTick(() => {
    if (textareaRef.value) textareaRef.value.style.height = 'auto'
  })
}

/** Grow the textarea with content, capped by the max-h-40 class. */
function autosize(): void {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

function scrollToBottom(): void {
  void nextTick(() => {
    scrollAreaRef.value?.scrollTo({ top: scrollAreaRef.value.scrollHeight, behavior: 'smooth' })
  })
}

watch([() => messages.value.length, isTyping], scrollToBottom)
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(120deg, var(--accent-primary), #3b82f6 60%, #a855f7);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Opaque input panel — same rationale as the widget window */
.chat-input {
  background-color: var(--card-bg);
}

/* Focus is indicated on the whole form (border + ring via focus-within);
   the global :focus-visible outline on the textarea itself would double it */
.chat-input textarea:focus-visible {
  outline: none;
}

/* Assistant bubble: opaque card background so the grid canvas doesn't bleed through */
.assistant-bubble {
  background-color: var(--card-bg);
}

.msg-enter-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.msg-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

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

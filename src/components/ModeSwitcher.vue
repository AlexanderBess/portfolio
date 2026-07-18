<template>
  <div class="relative grid grid-cols-2 items-center gap-1" role="group" :aria-label="t('header.mode.label')">
    <button
      class="mode-btn px-2 py-1 text-sm font-semibold transition-colors duration-200"
      :class="{ 'mode-btn--active': mode === 'resume' }"
      :aria-pressed="mode === 'resume'"
      @click="setMode('resume')"
    >
      {{ t('header.mode.resume') }}
    </button>

    <button
      class="mode-btn px-2 py-1 text-sm font-semibold transition-colors duration-200"
      :class="{ 'mode-btn--active': mode === 'chat' }"
      :aria-pressed="mode === 'chat'"
      @click="setMode('chat')"
    >
      {{ t('header.mode.chat') }}
    </button>

    <!-- Tiny indicator dot sliding under the active word -->
    <span
      class="pointer-events-none absolute -bottom-0.5 left-0 flex w-1/2 justify-center transition-transform duration-300"
      :class="mode === 'chat' ? 'translate-x-full' : 'translate-x-0'"
      aria-hidden="true"
    >
      <span class="mode-dot h-1.5 w-1.5 rounded-full bg-blue-500" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useViewMode } from '@/composables/useViewMode'

const { t } = useI18n()
const { mode, setMode } = useViewMode()
</script>

<style scoped>
.mode-btn {
  color: #8a8a93;
}

.mode-btn:hover {
  color: #52525b;
}

.mode-btn--active,
.mode-btn--active:hover {
  color: var(--text-primary);
}

[data-theme='dark'] .mode-btn {
  color: #737373; /* neutral-500 */
}

[data-theme='dark'] .mode-btn:hover {
  color: #d4d4d4; /* neutral-300 */
}

[data-theme='dark'] .mode-btn--active,
[data-theme='dark'] .mode-btn--active:hover {
  color: #ffffff;
}

.mode-dot {
  box-shadow: 0 0 6px rgba(59, 130, 246, 0.6);
}

@media (prefers-reduced-motion: reduce) {
  .pointer-events-none {
    transition: none;
  }
}
</style>

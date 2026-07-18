<template>
  <!-- ═══ variant="icon": mobile-only morphing icon button (header controls row) ═══ -->
  <button
    v-if="variant === 'icon'"
    class="mode-morph flex h-[38px] w-[38px] items-center justify-center rounded-full border md:hidden"
    :aria-label="switchLabel"
    @click="toggle"
  >
    <Transition name="morph" mode="out-in">
      <FileText v-if="mode !== 'resume'" key="resume" class="h-[18px] w-[18px]" aria-hidden="true" />
      <Bot v-else key="chat" class="h-[18px] w-[18px]" aria-hidden="true" />
    </Transition>
  </button>

  <!-- ═══ variant="status": desktop-only interactive status switcher ═══ -->
  <button
    v-else
    class="status-switch group relative hidden rounded-lg px-3 py-1.5 md:inline-grid"
    :aria-label="switchLabel"
    @click="toggle"
  >
    <!-- Idle layer: current mode -->
    <span class="status-switch__layer flex items-center gap-2 whitespace-nowrap text-sm">
      <component :is="currentIcon" class="h-4 w-4 text-theme-muted" aria-hidden="true" />
      <span class="status-switch__prefix font-mono text-xs">{{ t('header.mode.view') }}:</span>
      <span class="font-medium">{{ currentLabel }}</span>
    </span>

    <!-- Hover layer: offer to switch -->
    <span class="status-switch__layer status-switch__layer--hover flex items-center gap-2 whitespace-nowrap text-sm" aria-hidden="true">
      <component :is="targetIcon" class="h-4 w-4 text-blue-500" aria-hidden="true" />
      <span class="status-switch__prefix font-mono text-xs">{{ t('header.mode.switchTo') }}:</span>
      <span class="font-medium text-blue-500">{{ targetLabel }}</span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Bot, FileText } from 'lucide-vue-next'
import { useViewMode } from '@/composables/useViewMode'

interface Props {
  /** 'status' — desktop text switcher; 'icon' — mobile round morph button. */
  variant?: 'status' | 'icon'
}

withDefaults(defineProps<Props>(), { variant: 'status' })

const { t } = useI18n()
const { mode, setMode } = useViewMode()

const currentIcon = computed(() => (mode.value === 'resume' ? FileText : Bot))
const targetIcon = computed(() => (mode.value === 'resume' ? Bot : FileText))
const currentLabel = computed(() => t(mode.value === 'resume' ? 'header.mode.resume' : 'header.mode.chat'))
const targetLabel = computed(() => t(mode.value === 'resume' ? 'header.mode.chat' : 'header.mode.resume'))
const switchLabel = computed(() => `${t('header.mode.switchTo')}: ${targetLabel.value}`)

function toggle(): void {
  setMode(mode.value === 'resume' ? 'chat' : 'resume')
}
</script>

<style scoped>
/* ── Mobile morph button: same family as the other header controls ── */
.mode-morph {
  background: var(--chip-bg);
  border-color: var(--card-border);
  color: var(--text-primary);
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.mode-morph:hover {
  border-color: var(--card-border-hover);
  background-color: var(--card-bg);
}

/* Icon metamorphosis: quick fade + scale */
.morph-enter-active,
.morph-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.morph-enter-from,
.morph-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

/* ── Desktop status switcher: Zero-UI, layers stacked in one grid cell ── */
.status-switch__layer {
  grid-area: 1 / 1;
  transition: opacity 0.2s ease, transform 0.2s ease;
  color: var(--text-primary);
}

.status-switch__prefix {
  color: var(--text-secondary);
  opacity: 0.8;
}

.status-switch__layer--hover {
  opacity: 0;
  transform: translateY(4px);
}

.status-switch:hover .status-switch__layer:not(.status-switch__layer--hover),
.status-switch:focus-visible .status-switch__layer:not(.status-switch__layer--hover) {
  opacity: 0;
  transform: translateY(-4px);
}

.status-switch:hover .status-switch__layer--hover,
.status-switch:focus-visible .status-switch__layer--hover {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .morph-enter-active,
  .morph-leave-active,
  .status-switch__layer {
    transition: opacity 0.15s ease;
  }

  .morph-enter-from,
  .morph-leave-to,
  .status-switch__layer--hover,
  .status-switch:hover .status-switch__layer {
    transform: none;
  }
}
</style>

<template>
  <article
    ref="cardRef"
    class="bento-card group relative flex flex-col overflow-hidden rounded-2xl bg-theme-card p-6 transition-colors duration-300"
    :class="[colSpanClass, rowSpanClass]"
    @mousemove="onMouseMove"
  >
    <!-- Cursor-tracking radial glow -->
    <div
      class="bento-card__glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      aria-hidden="true"
    />

    <div class="relative z-10 flex h-full flex-col gap-sm">
      <slot />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export type BentoColSpan = 1 | 2 | 3 | 4
export type BentoRowSpan = 1 | 2

interface Props {
  /** Columns to span on desktop (lg). Mobile is always 1 column. */
  colSpan?: BentoColSpan
  /** Rows to span on desktop (lg). */
  rowSpan?: BentoRowSpan
  /** Glow tint, any valid CSS color. */
  glowColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  colSpan: 1,
  rowSpan: 1,
  glowColor: 'var(--glow-default)',
})

// Static class maps — Tailwind JIT needs literal class names
const COL_SPAN_CLASSES: Record<BentoColSpan, string> = {
  1: 'lg:col-span-1',
  2: 'md:col-span-2 lg:col-span-2',
  3: 'md:col-span-2 lg:col-span-3',
  4: 'md:col-span-2 lg:col-span-4',
}

const ROW_SPAN_CLASSES: Record<BentoRowSpan, string> = {
  1: '',
  2: 'lg:row-span-2',
}

const colSpanClass = computed(() => COL_SPAN_CLASSES[props.colSpan])
const rowSpanClass = computed(() => ROW_SPAN_CLASSES[props.rowSpan])

const cardRef = ref<HTMLElement | null>(null)

function onMouseMove(event: MouseEvent): void {
  const card = cardRef.value
  if (!card) return

  const rect = card.getBoundingClientRect()
  card.style.setProperty('--glow-x', `${event.clientX - rect.left}px`)
  card.style.setProperty('--glow-y', `${event.clientY - rect.top}px`)
}
</script>

<style scoped>
.bento-card {
  border: 1px solid var(--card-border);
  --glow-color: v-bind('props.glowColor');
}

.bento-card:hover {
  border-color: var(--card-border-hover);
}

.bento-card__glow {
  /* --glow-default fallback keeps the gradient valid if the v-bind() variable is momentarily missing (dev/HMR desync) */
  background: radial-gradient(
    420px circle at var(--glow-x, 50%) var(--glow-y, 50%),
    var(--glow-color, var(--glow-default)),
    transparent 65%
  );
}
</style>

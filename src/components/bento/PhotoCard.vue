<template>
  <div
    ref="cardRef"
    class="photo-card group relative overflow-hidden rounded-2xl lg:col-span-1 lg:aspect-square"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <!--
      Above-the-fold portrait → eager + high priority (it's an LCP candidate,
      lazy loading would hurt here). For below-the-fold photos use <AppImage>.
      Replace public/portrait.jpg with a real photo (3:4, ~900×1200).
    -->
    <img
      src="/src/assets/images/PNG/me.png"
      :alt="personalInfo.name"
      width="1000"
      height="1200"
      fetchpriority="high"
      decoding="async"
      class="aspect-[3/4] h-full w-full object-cover object-top lg:aspect-auto"
    />

    <!-- Moving glare -->
    <div class="photo-card__glare pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />

    <!-- Caption -->
    <div class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
      <p class="text-sm font-semibold text-white">{{ personalInfo.name }}</p>
      <p class="text-xs text-white/70">{{ t('bento.hero.title') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { portfolioData } from '@/data/portfolioData'

/**
 * Portrait bento card with a 3D tilt + glare that follows the cursor.
 * Pairs with the glow effect of the other cards. Tilt is skipped for
 * prefers-reduced-motion users; a rAF guard keeps mousemove cheap.
 */

const { t } = useI18n()
const { personalInfo } = portfolioData

const MAX_TILT_DEG = 9

const cardRef = ref<HTMLDivElement | null>(null)
let rafId = 0

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function onMouseMove(event: MouseEvent): void {
  const card = cardRef.value
  if (!card || reducedMotion) return

  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    const rect = card.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width // 0..1
    const py = (event.clientY - rect.top) / rect.height

    card.style.setProperty('--tilt-x', `${(py - 0.5) * -2 * MAX_TILT_DEG}deg`)
    card.style.setProperty('--tilt-y', `${(px - 0.5) * 2 * MAX_TILT_DEG}deg`)
    card.style.setProperty('--glare-x', `${px * 100}%`)
    card.style.setProperty('--glare-y', `${py * 100}%`)
  })
}

function onMouseLeave(): void {
  const card = cardRef.value
  if (!card) return

  cancelAnimationFrame(rafId)
  card.style.setProperty('--tilt-x', '0deg')
  card.style.setProperty('--tilt-y', '0deg')
}

onBeforeUnmount(() => cancelAnimationFrame(rafId))
</script>

<style scoped>
.photo-card {
  border: 1px solid var(--card-border);
  transform: perspective(900px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
  transition: transform 0.2s ease-out, border-color 0.3s ease;
  will-change: transform;
}

.photo-card:hover {
  border-color: var(--card-border-hover);
}

.photo-card__glare {
  background: radial-gradient(
    circle at var(--glare-x, 50%) var(--glare-y, 50%),
    rgba(255, 255, 255, 0.22),
    transparent 60%
  );
  mix-blend-mode: overlay;
}
</style>

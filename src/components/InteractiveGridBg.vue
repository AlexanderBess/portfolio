<template>
  <div
    ref="rootRef"
    class="grid-bg pointer-events-none fixed inset-0 -z-10"
    aria-hidden="true"
  >
    <div class="grid-bg__spotlight" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

/**
 * InteractiveGridBg — "engineering canvas" background.
 *
 * Rendering: a fixed, non-interactive layer (z-index: -1, pointer-events:
 * none) with a CSS-only grid pattern and a radial "flashlight" that follows
 * the pointer. Colors come from the theme tokens in main.scss
 * (--canvas-bg / --canvas-grid-line / --canvas-spotlight), so dark/light
 * switching is free.
 *
 * Performance:
 * - coordinates are written as CSS vars (--mouse-x/--mouse-y) on the root
 *   element only, strictly inside requestAnimationFrame — one style write
 *   per frame, no layout thrashing;
 * - no `filter: blur()` — softness comes from the radial gradient falloff,
 *   which mobile GPUs handle trivially;
 * - touch devices: the light glides to the tap/drag point (touchstart /
 *   touchmove) and fades out on touchend;
 * - prefers-reduced-motion: no listeners at all — a static, dim glow.
 */

const rootRef = ref<HTMLDivElement | null>(null)

let rafId = 0
let pendingX = 0
let pendingY = 0
let hasPendingFrame = false

function scheduleUpdate(x: number, y: number, opacity: number): void {
  pendingX = x
  pendingY = y

  const root = rootRef.value
  if (!root) return
  root.style.setProperty('--spotlight-opacity', String(opacity))

  if (hasPendingFrame) return
  hasPendingFrame = true

  rafId = requestAnimationFrame(() => {
    hasPendingFrame = false
    root.style.setProperty('--mouse-x', `${pendingX}px`)
    root.style.setProperty('--mouse-y', `${pendingY}px`)
  })
}

// --- Desktop: follow the mouse ---------------------------------------------------
function onMouseMove(event: MouseEvent): void {
  scheduleUpdate(event.clientX, event.clientY, 1)
}

// --- Touch: glide to the finger, fade out on release ------------------------------
function onTouch(event: TouchEvent): void {
  const touch = event.touches[0]
  if (touch) scheduleUpdate(touch.clientX, touch.clientY, 1)
}

function onTouchEnd(): void {
  rootRef.value?.style.setProperty('--spotlight-opacity', '0')
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Static soft glow near the hero area, no tracking
    rootRef.value?.style.setProperty('--spotlight-opacity', '0.6')
    return
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('touchstart', onTouch, { passive: true })
  window.addEventListener('touchmove', onTouch, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('touchstart', onTouch)
  window.removeEventListener('touchmove', onTouch)
  window.removeEventListener('touchend', onTouchEnd)
})
</script>

<style scoped>
.grid-bg {
  background-color: var(--canvas-bg);
  /* Grid step: denser on phones so the pattern doesn't shimmer, 40px from md */
  --grid-step: 28px;
}

@media (min-width: 768px) {
  .grid-bg {
    --grid-step: 40px;
  }
}

/* Grid pattern: two 1px line layers, zero JS involved */
.grid-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--canvas-grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--canvas-grid-line) 1px, transparent 1px);
  background-size: var(--grid-step) var(--grid-step);
}

/* Flashlight: soft radial falloff instead of filter:blur (mobile-friendly) */
.grid-bg__spotlight {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    560px circle at var(--mouse-x, 50%) var(--mouse-y, 35%),
    var(--canvas-spotlight),
    transparent 70%
  );
  opacity: var(--spotlight-opacity, 0);
  transition: opacity 0.6s ease;
}
</style>

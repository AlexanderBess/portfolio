<template>
  <div class="portfolio">
    <InteractiveGridBg />
    <Header />
    <main>
      <!-- Direction-aware: entering chat sweeps left, returning sweeps right -->
      <Transition :name="mode === 'chat' ? 'swipe-left' : 'swipe-right'" mode="out-in">
        <AiChatFullscreen v-if="mode === 'chat'" key="chat" />
        <router-view v-else key="resume" />
      </Transition>
    </main>
    <!-- FAB duplicates the fullscreen chat — resume mode only -->
    <AiTwinWidget v-if="mode === 'resume'" />
    <Analytics />
    <SpeedInsights />
  </div>
</template>

<script setup lang="ts">
import { Analytics } from '@vercel/analytics/vue'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import Header from './components/Header.vue'
import AiTwinWidget from './components/chat/AiTwinWidget.vue'
import AiChatFullscreen from './components/chat/AiChatFullscreen.vue'
import InteractiveGridBg from './components/InteractiveGridBg.vue'
import { useViewMode } from './composables/useViewMode'

const { mode } = useViewMode()
</script>

<style scoped lang="scss">
@use './styles/variables' as *;

.portfolio {
  min-height: 100vh;
  // Must stay transparent — the background is painted by InteractiveGridBg (fixed, z-index: -1) behind it
  background: transparent;
  transition: var(--theme-transition);
}

// Resume ↔ Chat: horizontal swipe + fade with a dimming "into the shadow" exit
.swipe-left-enter-active,
.swipe-left-leave-active,
.swipe-right-enter-active,
.swipe-right-leave-active {
  transition:
    opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    filter 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

// Forward (→ chat): old content exits left, new enters from the right
.swipe-left-enter-from {
  opacity: 0;
  transform: translateX(56px);
  filter: brightness(0.75);
}

.swipe-left-leave-to {
  opacity: 0;
  transform: translateX(-56px);
  filter: brightness(0.75);
}

// Back (→ resume): mirrored
.swipe-right-enter-from {
  opacity: 0;
  transform: translateX(-56px);
  filter: brightness(0.75);
}

.swipe-right-leave-to {
  opacity: 0;
  transform: translateX(56px);
  filter: brightness(0.75);
}

@media (prefers-reduced-motion: reduce) {
  .swipe-left-enter-active,
  .swipe-left-leave-active,
  .swipe-right-enter-active,
  .swipe-right-leave-active {
    transition: opacity 0.25s ease;
  }

  .swipe-left-enter-from,
  .swipe-left-leave-to,
  .swipe-right-enter-from,
  .swipe-right-leave-to {
    transform: none;
    filter: none;
  }
}
</style>


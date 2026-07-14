<template>
  <div class="portfolio">
    <InteractiveGridBg />
    <Header />
    <main>
      <router-view />
    </main>
    <AiTwinWidget />
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import AiTwinWidget from './components/chat/AiTwinWidget.vue'
import InteractiveGridBg from './components/InteractiveGridBg.vue'
</script>

<style scoped lang="scss">
// Import variables
@use './styles/variables' as *;

.portfolio {
  min-height: 100vh;
  // Background is painted by InteractiveGridBg (fixed, z-index: -1);
  // an opaque background here would cover it.
  background: transparent;
  transition: var(--theme-transition);
}
</style>


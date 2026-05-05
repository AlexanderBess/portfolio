<template>
  <div class="portfolio">
    <Header />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
</script>

<style scoped lang="scss">
// Import variables
@use './styles/variables' as *;

.portfolio {
  min-height: 100vh;
  background: var(--bg-primary);
  transition: var(--theme-transition);
}
</style>


<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
</script>

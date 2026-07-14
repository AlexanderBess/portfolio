<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[minmax(170px,auto)]">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Layout-only wrapper; cards control their own spans via BentoCard props.
</script>

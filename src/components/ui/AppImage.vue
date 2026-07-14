<template>
  <picture>
    <source v-if="avifSrc" :srcset="avifSrc" type="image/avif" />
    <source v-if="webpSrc" :srcset="webpSrc" type="image/webp" />
    <img
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : 'auto'"
      decoding="async"
      class="app-image"
      :class="{ 'app-image--loaded': isLoaded }"
      @load="isLoaded = true"
    />
  </picture>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * Performance-first image helper: <picture> AVIF → WebP → original; required width/height keep CLS at 0.
 * Usage:
 *   <AppImage src="/photos/trip.jpg" alt="Fog over the mountains" :width="800" :height="600" />
 * Sibling .avif/.webp files (same path, different extension) are picked up automatically. Convert with
 *   npx @squoosh/cli --avif auto --webp auto "src/assets/images/PNG/*.png" — or vite-imagetools at build time.
 */

interface Props {
  src: string
  alt: string
  width: number
  height: number
  /** Set for above-the-fold images (disables lazy loading, boosts priority). */
  eager?: boolean
  /** Set to false if no .avif/.webp siblings exist for this image. */
  modernFormats?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  eager: false,
  modernFormats: true,
})

const isLoaded = ref(false)

function withExtension(extension: string): string | null {
  if (!props.modernFormats) return null
  return props.src.replace(/\.(jpe?g|png)$/i, `.${extension}`)
}

const avifSrc = computed(() => withExtension('avif'))
const webpSrc = computed(() => withExtension('webp'))
</script>

<style scoped>
.app-image {
  display: block;
  max-width: 100%;
  height: auto;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.app-image--loaded {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .app-image {
    opacity: 1;
    transition: none;
  }
}
</style>

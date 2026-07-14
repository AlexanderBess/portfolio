<template>
  <section
    aria-labelledby="projects-title"
    class="mx-auto w-full max-w-6xl px-4 py-12 text-theme-text sm:px-6"
  >
    <div class="mb-8 flex items-center gap-3">
      <FolderGit2 class="h-6 w-6 text-primary-500" aria-hidden="true" />
      <h2 id="projects-title" class="text-2xl font-bold sm:text-3xl">{{ t('bento.projects.title') }}</h2>
    </div>

    <!-- Native scroll-snap carousel, no libraries -->
    <div class="relative">
      <!-- Fades sit at the track's real edges — the track bleeds past this wrapper by -mx-4 / sm:-mx-6 -->
      <div
        v-show="canScrollPrev"
        class="carousel-fade carousel-fade--left pointer-events-none absolute inset-y-0 -left-4 z-10 w-10 sm:-left-6 sm:w-12"
        aria-hidden="true"
      />
      <div
        v-show="canScrollNext"
        class="carousel-fade carousel-fade--right pointer-events-none absolute inset-y-0 -right-4 z-10 w-10 sm:-right-6 sm:w-12"
        aria-hidden="true"
      />

      <!-- Floating arrows -->
      <button
        v-show="canScrollPrev"
        :aria-label="t('bento.projects.prev')"
        class="carousel-arrow absolute -left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-theme-border text-theme-muted shadow-lg transition-all hover:border-theme-border-hover hover:text-theme-text sm:flex"
        @click="scrollByCard(-1)"
      >
        <ArrowLeft class="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        v-show="canScrollNext"
        :aria-label="t('bento.projects.next')"
        class="carousel-arrow absolute -right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-theme-border text-theme-muted shadow-lg transition-all hover:border-theme-border-hover hover:text-theme-text sm:flex"
        @click="scrollByCard(1)"
      >
        <ArrowRight class="h-5 w-5" aria-hidden="true" />
      </button>

      <div
        ref="trackRef"
      role="region"
      :aria-label="t('bento.projects.title')"
      tabindex="0"
      class="projects-track -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6"
      :class="{ 'snap-none cursor-grabbing select-none': isDragging }"
      @scroll.passive="updateScrollState"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @click.capture="suppressClickAfterDrag"
    >
      <BentoCard
        v-for="(project, index) in projects"
        :key="project.id"
        class="w-[85%] shrink-0 snap-start sm:w-[55%] lg:w-[42%]"
      >
        <div class="mb-4 flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <component :is="PROJECT_ICONS[project.id]" class="h-5 w-5 shrink-0 text-primary-500" aria-hidden="true" />
            <h3 class="text-lg font-semibold">
              {{ t(`bento.projects.items.${project.id}.name`) }}
            </h3>
          </div>
          <span class="select-none text-3xl font-bold leading-none text-theme-muted opacity-25" aria-hidden="true">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
        </div>

        <p class="text-sm leading-relaxed text-theme-muted">
          {{ t(`bento.projects.items.${project.id}.description`) }}
        </p>

        <div class="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
          <ul class="flex flex-wrap gap-2">
            <li
              v-for="tech in project.techStack"
              :key="tech"
              class="rounded-lg border border-theme-border bg-theme-chip px-2.5 py-1 text-xs text-theme-muted"
            >
              {{ tech }}
            </li>
          </ul>
          <a
            v-if="project.link"
            :href="project.link"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`${t(`bento.projects.items.${project.id}.name`)} — ${t('bento.projects.visit')}`"
            class="inline-flex items-center gap-1.5 text-sm text-primary-500 transition-opacity hover:opacity-80"
            draggable="false"
          >
            {{ t('bento.projects.visit') }}
            <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </BentoCard>

      <!-- ═══ GitHub CTA — last slide ═══ -->
      <BentoCard
        glow-color="rgba(0, 242, 254, 0.14)"
        class="w-[85%] shrink-0 snap-start sm:w-[55%] lg:w-[42%]"
      >
        <div class="flex h-full flex-col items-start justify-center gap-4">
          <div class="flex items-center gap-3">
            <Github class="h-6 w-6 text-primary-500" aria-hidden="true" />
            <h3 class="text-lg font-semibold">{{ t('bento.projects.github.title') }}</h3>
          </div>
          <p class="text-sm text-theme-muted">{{ t('bento.projects.github.text') }}</p>
          <a
            :href="personalInfo.github"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            draggable="false"
          >
            {{ t('bento.projects.github.cta') }}
            <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </BentoCard>
      </div>
    </div>

    <!-- Dots pagination -->
    <div class="mt-5 flex justify-center gap-2">
      <button
        v-for="index in slideCount"
        :key="index"
        :aria-label="`${t('bento.projects.goTo')} ${index}`"
        :aria-current="activeIndex === index - 1 ? 'true' : undefined"
        class="h-2 rounded-full transition-all duration-300"
        :class="activeIndex === index - 1 ? 'w-8 bg-primary-500' : 'w-2 bg-theme-chip border border-theme-border hover:bg-theme-border'"
        @click="scrollToIndex(index - 1)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Boxes,
  ClipboardList,
  Coins,
  FolderGit2,
  Github,
  Mountain,
} from 'lucide-vue-next'
import BentoCard from './BentoCard.vue'
import { portfolioData, type ProjectId } from '@/data/portfolioData'

const { t } = useI18n()
const { projects, personalInfo } = portfolioData

const PROJECT_ICONS: Record<ProjectId, Component> = {
  p2pMarketplace: Coins,
  showcase3d: Boxes,
  uiKit: Blocks,
  surveyPlatform: ClipboardList,
  terrainGenerator: Mountain,
}

// --- Scroll state --------------------------------------------------------------
const trackRef = ref<HTMLDivElement | null>(null)
const canScrollPrev = ref(false)
const canScrollNext = ref(true)
const activeIndex = ref(0)

/** Project cards + the GitHub CTA slide. */
const slideCount = projects.length + 1

const GAP_PX = 16

function slideWidth(track: HTMLDivElement): number {
  const card = track.firstElementChild as HTMLElement | null
  return (card?.offsetWidth ?? track.clientWidth) + GAP_PX
}

function updateScrollState(): void {
  const track = trackRef.value
  if (!track) return
  const max = track.scrollWidth - track.clientWidth
  canScrollPrev.value = track.scrollLeft > 4
  canScrollNext.value = track.scrollLeft < max - 4
  activeIndex.value =
    track.scrollLeft >= max - 4
      ? slideCount - 1
      : Math.min(Math.round(track.scrollLeft / slideWidth(track)), slideCount - 1)
}

function smoothBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

function scrollByCard(direction: 1 | -1): void {
  const track = trackRef.value
  if (!track) return
  track.scrollBy({ left: direction * slideWidth(track), behavior: smoothBehavior() })
}

function scrollToIndex(index: number): void {
  const track = trackRef.value
  if (!track) return
  track.scrollTo({ left: index * slideWidth(track), behavior: smoothBehavior() })
}

// --- Drag-to-scroll (mouse only; touch uses native scrolling) --------------------
const isDragging = ref(false)
let dragMoved = false

function onPointerDown(event: PointerEvent): void {
  if (event.pointerType !== 'mouse' || event.button !== 0) return
  isDragging.value = true
  dragMoved = false
  trackRef.value?.setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent): void {
  if (!isDragging.value || !trackRef.value) return
  if (Math.abs(event.movementX) > 2) dragMoved = true
  trackRef.value.scrollLeft -= event.movementX
}

function onPointerUp(event: PointerEvent): void {
  if (!isDragging.value) return
  isDragging.value = false
  trackRef.value?.releasePointerCapture(event.pointerId)
}

/** A drag shouldn't trigger the link the cursor happened to end on. */
function suppressClickAfterDrag(event: MouseEvent): void {
  if (dragMoved) {
    event.preventDefault()
    event.stopPropagation()
    dragMoved = false
  }
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  updateScrollState()
  resizeObserver = new ResizeObserver(updateScrollState)
  if (trackRef.value) resizeObserver.observe(trackRef.value)
})

onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<style scoped>
/* Hide the native scrollbar — arrows + dots take over its job */
.projects-track {
  scrollbar-width: none;
}

.projects-track::-webkit-scrollbar {
  display: none;
}

.carousel-arrow {
  background-color: var(--card-bg);
}

.carousel-fade--left {
  background: linear-gradient(to right, var(--bg-primary), transparent);
}

.carousel-fade--right {
  background: linear-gradient(to left, var(--bg-primary), transparent);
}
</style>

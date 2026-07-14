<template>
  <section
    id="experience"
    aria-labelledby="experience-title"
    class="mx-auto w-full max-w-6xl px-4 py-12 text-theme-text sm:px-6"
  >
    <div class="mb-8 flex items-center gap-3">
      <Briefcase class="h-6 w-6 text-primary-500" aria-hidden="true" />
      <h2 id="experience-title" class="text-2xl font-bold sm:text-3xl">{{ t('bento.experience.title') }}</h2>
    </div>

    <ol class="relative space-y-6 pl-8">
      <li
        v-for="(job, index) in experience"
        :key="job.id"
        v-reveal="Math.min(index, 2) * 80"
        class="timeline-item relative"
      >
        <!-- Timeline dot (pulsing for the current position) -->
        <span
          class="absolute -left-[2.375rem] top-8 flex h-3 w-3 items-center justify-center"
          aria-hidden="true"
        >
          <span
            v-if="index === 0"
            class="absolute h-full w-full animate-ping rounded-full bg-primary-500/60"
          />
          <span class="relative h-3 w-3 rounded-full bg-primary-500" />
        </span>

        <BentoCard>
          <header class="mb-4">
            <div class="flex flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3">
              <h3 class="text-lg font-semibold leading-tight">
                {{ job.company }}
              </h3>
              <span class="text-sm font-medium text-primary-500">
                {{ t(`bento.experience.jobs.${job.id}.role`) }}
              </span>
            </div>

            <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-theme-muted">
              <span class="flex items-center gap-1.5">
                <CalendarDays class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {{ t(`bento.experience.jobs.${job.id}.period`) }}
              </span>
              <span class="flex items-center gap-1.5">
                <MapPin class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {{ t(`bento.experience.jobs.${job.id}.location`) }}
              </span>
            </div>
          </header>

          <ul class="space-y-2">
            <li
              v-for="(achievement, i) in achievementsOf(job.id)"
              :key="i"
              class="flex gap-2.5 text-sm leading-relaxed text-theme-muted"
            >
              <ChevronRight class="mt-1 h-3.5 w-3.5 shrink-0 text-primary-500" />
              <span>{{ achievement }}</span>
            </li>
          </ul>

          <footer class="mt-4 flex flex-wrap gap-2 pt-1">
            <span
              v-for="tech in job.techStack"
              :key="tech"
              class="rounded-lg border border-theme-border bg-theme-chip px-2.5 py-1 text-xs text-theme-muted"
            >
              {{ tech }}
            </span>
          </footer>
        </BentoCard>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Briefcase, CalendarDays, ChevronRight, MapPin } from 'lucide-vue-next'
import BentoCard from './BentoCard.vue'
import { portfolioData, type JobId } from '@/data/portfolioData'

const { t, tm, rt } = useI18n()
const { experience } = portfolioData

/** vue-i18n stores array messages as compiled ASTs — `tm` retrieves the array, `rt` renders each item to a string. */
function achievementsOf(id: JobId): string[] {
  const messages = tm(`bento.experience.jobs.${id}.achievements`) as unknown[]
  return messages.map((message) => rt(message as Parameters<typeof rt>[0]))
}
</script>

<style scoped>
/* Timeline segment: each item (except the last) draws a line from its dot to the next item's dot.
   top: 2rem — the dot's top-8 offset; bottom: -3.5rem — space-y-6 gap (1.5rem) + next dot's offset (2rem). */
.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: calc(-2rem - 0.5px); /* dot center: -2.375rem + half of 12px dot */
  top: 2rem;
  bottom: -3.5rem;
  width: 1px;
  background: var(--card-border);
}
</style>

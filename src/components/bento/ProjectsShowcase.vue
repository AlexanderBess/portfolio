<template>
  <section
    aria-labelledby="projects-title"
    class="mx-auto w-full max-w-6xl px-4 py-12 text-theme-text sm:px-6"
  >
    <div class="mb-8 flex items-center gap-3">
      <FolderGit2 class="h-6 w-6 text-primary-500" aria-hidden="true" />
      <h2 id="projects-title" class="text-2xl font-bold sm:text-3xl">{{ t('bento.projects.title') }}</h2>
    </div>

    <!-- "Monorepo in an editor": title bar, project rows, git footer -->
    <div v-reveal class="editor overflow-hidden rounded-2xl border border-theme-border">
      <!-- Title bar -->
      <div class="flex items-center justify-between border-b border-theme-border px-4 py-2.5">
        <div class="flex items-center gap-1.5" aria-hidden="true">
          <span class="h-2.5 w-2.5 rounded-full bg-[#ff5f57] opacity-80" />
          <span class="h-2.5 w-2.5 rounded-full bg-[#febc2e] opacity-80" />
          <span class="h-2.5 w-2.5 rounded-full bg-[#28c840] opacity-80" />
        </div>
        <span class="font-mono text-xs text-theme-muted">~/alex-bess/projects</span>
      </div>

      <!-- Project rows -->
      <ul class="divide-y divide-theme-border">
        <li
          v-for="(project, index) in projects"
          :key="project.id"
          class="project-row"
          :style="{ '--tech-accent': techColor(project.techStack[0]) }"
          :class="{ 'project-row--open': openIndex === index }"
        >
          <button
            class="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-theme-chip"
            :aria-expanded="openIndex === index"
            @click="toggle(index)"
          >
            <span class="font-mono text-xs tabular-nums text-theme-muted opacity-60">
              {{ String(index + 1).padStart(2, '0') }}
            </span>

            <span class="flex min-w-0 items-baseline gap-2.5">
              <span class="truncate font-mono text-sm font-medium">{{ SLUGS[project.id] }}/</span>
              <span class="hidden truncate text-xs text-theme-muted sm:inline">
                {{ t(`bento.projects.items.${project.id}.name`) }}
              </span>
            </span>

            <span class="flex items-center gap-3">
              <!-- Top-3 stack badges with brand-colored dots -->
              <span class="hidden items-center gap-3 md:flex">
                <span
                  v-for="tech in project.techStack.slice(0, 3)"
                  :key="tech"
                  class="flex items-center gap-1.5 font-mono text-xs text-theme-muted"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :style="{ background: techColor(tech) }" />
                  {{ tech }}
                </span>
              </span>
              <ChevronDown
                class="h-4 w-4 text-theme-muted transition-transform duration-300"
                :class="{ 'rotate-180': openIndex === index }"
                aria-hidden="true"
              />
            </span>
          </button>

          <!-- Accordion body (CSS grid-rows animation, no JS measuring) -->
          <div class="project-row__body">
            <div class="overflow-hidden">
              <div class="px-4 pb-5 pt-1 sm:pl-12">
                <p class="max-w-3xl text-sm leading-relaxed text-theme-muted">
                  {{ t(`bento.projects.items.${project.id}.description`) }}
                </p>

                <div class="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    v-for="tech in project.techStack"
                    :key="tech"
                    class="flex items-center gap-1.5 rounded-lg border border-theme-border bg-theme-chip px-2.5 py-1 font-mono text-xs text-theme-muted"
                  >
                    <span class="h-1.5 w-1.5 rounded-full" :style="{ background: techColor(tech) }" />
                    {{ tech }}
                  </span>

                  <a
                    v-if="project.link"
                    :href="project.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="ml-auto inline-flex items-center gap-1.5 text-sm text-primary-500 transition-opacity hover:opacity-80"
                  >
                    {{ t('bento.projects.visit') }}
                    <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>

      <!-- Footer: git clone + GitHub CTA -->
      <div class="flex items-center justify-between gap-4 border-t border-theme-border px-4 py-3">
        <span class="truncate font-mono text-xs text-theme-muted">
          <span class="select-none opacity-60">$</span> gh repo list AlexanderBess
        </span>
        <a
          :href="personalInfo.github"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-theme-border bg-theme-chip px-3 py-1.5 text-xs font-medium text-theme-muted transition-colors hover:border-theme-border-hover hover:text-theme-text"
        >
          <Github class="h-3.5 w-3.5" aria-hidden="true" />
          {{ t('bento.projects.github.cta') }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowUpRight, ChevronDown, FolderGit2, Github } from 'lucide-vue-next'
import { portfolioData, type ProjectId } from '@/data/portfolioData'

const { t } = useI18n()
const { projects, personalInfo } = portfolioData

/** First row open by default; clicking an open row collapses it. */
const openIndex = ref(0)

function toggle(index: number): void {
  openIndex.value = openIndex.value === index ? -1 : index
}

const SLUGS: Record<ProjectId, string> = {
  p2pMarketplace: 'p2p-marketplace',
  cryptoCard: 'crypto-card',
  uiKit: 'ui-kit',
  surveyPlatform: 'survey-platform',
  terrainGenerator: 'terrain-generator',
}

/** Brand-ish colors for stack badges; muted fallback for the rest. */
const TECH_COLORS: Record<string, string> = {
  'Vue 3': '#42b883',
  'Vue.js': '#42b883',
  'Nuxt.js': '#00dc82',
  React: '#61dafb',
  'Next.js': '#61dafb',
  TypeScript: '#3178c6',
  'Three.js': '#8b5cf6',
  WebSockets: '#f59e0b',
  Pinia: '#ffd859',
  Storybook: '#ff4785',
  Figma: '#a259ff',
  Vite: '#646cff',
  SSR: '#10b981',
  SEO: '#22c55e',
  WCAG: '#0ea5e9',
  'Simplex Noise': '#94a3b8',
  'CSS Animations': '#38bdf8',
}

function techColor(tech: string): string {
  return TECH_COLORS[tech] ?? '#64748b'
}
</script>

<style scoped>
/* Opaque editor panel over the grid canvas */
.editor {
  background-color: var(--card-bg);
}

/* Accent stripe in the main technology's brand color for the open row */
.project-row {
  border-left: 2px solid transparent;
  transition: border-color 0.3s ease;
}

.project-row--open {
  border-left-color: var(--tech-accent);
}

/* Accordion: grid-template-rows 0fr -> 1fr gives a cheap, smooth height
   animation without JS measuring */
.project-row__body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-row--open .project-row__body {
  grid-template-rows: 1fr;
}

@media (prefers-reduced-motion: reduce) {
  .project-row__body {
    transition: none;
  }
}
</style>

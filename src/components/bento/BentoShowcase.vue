<template>
  <section class="mx-auto w-full max-w-6xl px-4 pb-12 text-theme-text sm:px-6">
    <BentoGrid>
      <!-- ═══ Hero ═══ -->
      <BentoCard v-reveal :col-span="2" :row-span="2" glow-color="rgba(0, 242, 254, 0.12)">
        <ThreeHeroScene />
        <p class="mb-3 inline-flex w-fit items-center gap-2 rounded-md border border-theme-border px-3 py-1 text-xs uppercase tracking-widest text-theme-muted">
          <Sparkles class="h-3.5 w-3.5" />
          {{ t('bento.hero.badge', { years: personalInfo.experienceYears }) }}
        </p>

        <h1 class="text-4xl font-bold leading-tight sm:text-5xl">
          {{ personalInfo.name }}
        </h1>
        <h2 class="mt-2 text-xl font-medium text-primary-500">
          {{ t('bento.hero.title') }}
        </h2>
        <p class="mt-4 max-w-md text-sm leading-relaxed text-theme-muted">
          {{ t('bento.hero.subtitle') }}
        </p>

        <div class="mt-auto flex flex-wrap gap-3 pt-8">
          <a
            v-for="link in socialLinks"
            :key="link.labelKey"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="t(link.labelKey)"
            class="inline-flex items-center gap-2 rounded-xl border border-theme-border bg-theme-chip px-4 py-2 text-sm text-theme-muted transition-colors hover:border-theme-border-hover hover:text-theme-text"
          >
            <component :is="link.icon" class="h-4 w-4" />
            {{ t(link.labelKey) }}
          </a>
        </div>
      </BentoCard>

      <!-- ═══ Photo ═══ -->
      <PhotoCard v-reveal="60" />

      <!-- ═══ Skills (1-wide groups) ═══ -->
      <BentoCard
        v-for="(group, i) in primarySkillGroups"
        :key="group.id"
        v-reveal="120 + i * 60"
        :col-span="group.colSpan"
        :glow-color="group.glowColor"
      >
        <CardHeading :icon="group.icon" :title="t(`bento.skills.${group.id}`)" />
        <ul class="flex flex-wrap gap-2">
          <li
            v-for="skill in group.items"
            :key="skill"
            class="rounded-lg border border-theme-border bg-theme-chip px-2.5 py-1 text-xs text-theme-muted"
          >
            {{ skill }}
          </li>
        </ul>
      </BentoCard>

      <!-- ═══ Contact CTA (fills the cell under the square photo) ═══ -->
      <BentoCard v-reveal="240" glow-color="rgba(0, 242, 254, 0.14)">
        <CardHeading :icon="Mail" :title="t('bento.contact.title')" />
        <p class="text-sm text-theme-muted">{{ t('bento.contact.text') }}</p>
        <a
          :href="`mailto:${personalInfo.email}`"
          :title="personalInfo.email"
          :aria-label="`${t('bento.contact.cta')}: ${personalInfo.email}`"
          class="mt-auto inline-flex w-fit max-w-full items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Send class="h-4 w-4 shrink-0" />
          <span class="truncate">{{ t('bento.contact.cta') }}</span>
        </a>
      </BentoCard>

      <!-- ═══ Skills (wide groups) ═══ -->
      <BentoCard
        v-for="group in secondarySkillGroups"
        :key="group.id"
        v-reveal="120"
        :col-span="group.colSpan"
        :glow-color="group.glowColor"
      >
        <CardHeading :icon="group.icon" :title="t(`bento.skills.${group.id}`)" />
        <ul class="flex flex-wrap gap-2">
          <li
            v-for="skill in group.items"
            :key="skill"
            class="rounded-lg border border-theme-border bg-theme-chip px-2.5 py-1 text-xs text-theme-muted"
          >
            {{ skill }}
          </li>
        </ul>
      </BentoCard>

      <!-- ═══ About ═══ -->
      <BentoCard v-reveal="60" :col-span="2">
        <CardHeading :icon="UserRound" :title="t('bento.about.title')" />
        <p class="text-sm leading-relaxed text-theme-muted">
          {{ t('bento.about.text') }}
        </p>
      </BentoCard>

      <!-- ═══ Interests ═══ -->
      <BentoCard
        v-for="(interest, i) in interests"
        :key="interest.id"
        v-reveal="i * 60"
        :col-span="interest.id === 'photography' ? 2 : 1"
        glow-color="rgba(168, 85, 247, 0.12)"
      >
        <CardHeading
          :icon="INTEREST_ICONS[interest.icon]"
          :title="t(`bento.interests.${interest.id}.name`)"
        />
        <p class="text-sm leading-relaxed text-theme-muted">
          {{ t(`bento.interests.${interest.id}.description`) }}
        </p>
      </BentoCard>

    </BentoGrid>
  </section>
</template>

<script setup lang="ts">
import type { Component, FunctionalComponent } from 'vue'
import { defineAsyncComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Camera,
  Compass,
  Cpu,
  Gamepad2,
  Github,
  Layers,
  Linkedin,
  Mail,
  Send,
  Sparkles,
  UserRound,
  Wrench,
} from 'lucide-vue-next'
import BentoGrid from './BentoGrid.vue'
import BentoCard, { type BentoColSpan } from './BentoCard.vue'
import PhotoCard from './PhotoCard.vue'
import { portfolioData, type InterestIcon, type Skills } from '@/data/portfolioData'

// Lazy chunk: keeps three.js out of the main bundle
const ThreeHeroScene = defineAsyncComponent(() => import('./ThreeHeroScene.vue'))

const { t } = useI18n()
const { personalInfo, skills, interests } = portfolioData

// --- Reusable card heading ---------------------------------------------------
const CardHeading: FunctionalComponent<{ icon: Component; title: string }> = (props) =>
  h('div', { class: 'mb-4 flex items-center gap-2.5' }, [
    h(props.icon, { class: 'h-5 w-5 text-primary-500' }),
    h('h3', { class: 'text-base font-semibold text-theme-text' }, props.title),
  ])
CardHeading.props = ['icon', 'title']

// --- Social links --------------------------------------------------------------
interface SocialLink {
  labelKey: string
  href: string
  icon: Component
}

const socialLinks: SocialLink[] = [
  { labelKey: 'bento.social.github', href: personalInfo.github, icon: Github },
  { labelKey: 'bento.social.linkedin', href: personalInfo.linkedin, icon: Linkedin },
  {
    labelKey: 'bento.social.telegram',
    href: `https://t.me/${personalInfo.telegram.replace('@', '')}`,
    icon: Send,
  },
]

// --- Skill groups ---------------------------------------------------------------
interface SkillGroup {
  /** i18n key suffix under `bento.skills.*` and key of `Skills` in portfolioData */
  id: keyof Skills
  items: string[]
  icon: Component
  colSpan: BentoColSpan
  glowColor: string
}

// Rendered in two batches so the Contact CTA lands in the grid cell
// right under the square photo (see template order).
const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    items: skills.frontend,
    icon: Layers,
    colSpan: 1,
    glowColor: 'rgba(59, 130, 246, 0.14)',
  },
  {
    id: 'architecture',
    items: skills.architecture,
    icon: Cpu,
    colSpan: 1,
    glowColor: 'rgba(59, 130, 246, 0.14)',
  },
  {
    id: 'toolsAndAI',
    items: skills.toolsAndAI,
    icon: Wrench,
    colSpan: 2,
    glowColor: 'rgba(0, 242, 254, 0.12)',
  },
]

const primarySkillGroups = skillGroups.filter((g) => g.colSpan === 1)
const secondarySkillGroups = skillGroups.filter((g) => g.colSpan > 1)

// --- Interest icons ---------------------------------------------------------------
const INTEREST_ICONS: Record<InterestIcon, Component> = {
  camera: Camera,
  compass: Compass,
  'gamepad-2': Gamepad2,
}
</script>

<template>
  <section id="contact" class="mx-auto w-full max-w-6xl px-4 py-12 text-theme-text sm:px-6">
    <BentoCard v-reveal glow-color="rgba(0, 242, 254, 0.12)">
      <div class="flex flex-col items-center gap-6 py-10 text-center sm:py-14">
        <h2 class="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
          {{ t('bento.contactSection.title') }}
        </h2>
        <p class="max-w-xl text-sm leading-relaxed text-theme-muted sm:text-base">
          {{ t('bento.contactSection.text') }}
        </p>

        <div class="mt-2 flex flex-wrap justify-center gap-3">
          <a
            :href="telegramHref"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            <Send class="h-4 w-4" />
            {{ t('bento.contactSection.telegram') }}
          </a>
          <a
            :href="`mailto:${personalInfo.email}`"
            class="inline-flex items-center gap-2 rounded-xl border border-theme-border bg-theme-chip px-5 py-2.5 text-sm text-theme-muted transition-colors hover:border-theme-border-hover hover:text-theme-text"
          >
            <Mail class="h-4 w-4" />
            {{ t('bento.contactSection.email') }}
          </a>
        </div>
      </div>
    </BentoCard>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Mail, Send } from 'lucide-vue-next'
import BentoCard from './BentoCard.vue'
import { portfolioData } from '@/data/portfolioData'

const { t } = useI18n()
const { personalInfo } = portfolioData

const telegramHref = `https://t.me/${personalInfo.telegram.replace('@', '')}`
</script>

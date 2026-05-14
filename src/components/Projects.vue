<template>
  <section class="experiences">
    <div class="experiences__sidebar">
      <h2 class="experiences__title">{{ t("projects.experiences") }}</h2>
    </div>

    <div class="experiences__grid">
      <div
          v-for="item in EXPERIENCES"
          :key="item.company"
          class="experience-card"
          :class="{ 'is-active': activeCompany === item.company }"
          @click="toggleCard(item.company)"
      >
        <div class="experience-card__header">
          <span class="experience-card__year">{{ item.year }}</span>
          <span class="experience-card__chevron">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </div>

        <div class="experience-card__content">
          <h3 class="experience-card__role">{{ item.role }}</h3>
          <p class="experience-card__company">{{ item.company }}</p>

          <div class="experience-card__details">
            <p class="experience-card__description">{{ t(`projects.${item.descKey}`) }}</p>
            <a :href="item.link" target="_blank" class="experience-card__link" @click.stop>
              {{ t('projects.visit_site') }} ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const activeCompany = ref<string | null>(null);

const toggleCard = (company: string) => {
  if (window.innerWidth <= 1024) {
    activeCompany.value = activeCompany.value === company ? null : company;
  }
};

const EXPERIENCES = [
  { year: '2019', role: 'Web Developer', company: 'Chrono', descKey: 'chrono_desc', link: 'https://chrono.tech' },
  { year: '2021', role: 'Frontend Developer', company: 'Crypton Studio', descKey: 'crypton_desc', link: 'https://crypton.studio' },
  { year: '2022', role: 'Frontend Developer', company: 'Tenzor', descKey: 'tenzor_desc', link: 'https://sbis.ru' },
  { year: '2023', role: 'Frontend Developer', company: 'Anketolog', descKey: 'anketolog_desc', link: 'https://anketolog.ru' },
  { year: '2023', role: 'Frontend Developer', company: 'WSender', descKey: 'wsender_desc', link: 'https://wsender.ru' },
  { year: '2024 - Present', role: 'Frontend Developer', company: 'EMCD', descKey: 'emcd_desc', link: 'https://emcd.io' },
] as const;
</script>

<style scoped lang="scss">
.experiences {
  display: flex;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 60px 40px;
  background-color: transparent;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--text-primary);

  &__sidebar {
    flex: 0 0 25%;
  }

  &__title {
    font-size: 24px;
    font-weight: 400;
    margin: 0;
  }

  &__grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
  }
}

.experience-card {
  display: flex;
  flex-direction: column;
  gap: 30px;
  position: relative;
  transition: opacity 0.3s ease;
  cursor: pointer;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__year {
    font-size: 20px;
    color: var(--text-secondary);
    font-weight: 400;
  }

  &__chevron {
    display: none;
    color: var(--text-secondary);
    transition: transform 0.3s ease;

    svg {
      display: block;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: relative;
  }

  &__role {
    font-size: 16px;
    font-weight: 400;
    margin: 0;
  }

  &__company {
    font-size: 16px;
    color: var(--text-secondary);
    margin: 0;
  }

  &__details {
    padding: 12px;
    border-radius: 12px;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);

    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 10;
    background: var(--text-primary);
  }

  &__description {
    font-size: 14px;
    line-height: 1.5;
    color: var(--bg-primary);
    margin-bottom: 12px;
  }

  &__link {
    font-size: 14px;
    color: var(--bg-primary);
    text-decoration: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    padding-bottom: 2px;
    display: inline-block;

    &:hover {
      border-bottom-color: var(--bg-secondary);
    }
  }

  @media (min-width: 769px) {
    &:hover {
      .experience-card__details {
        max-height: 300px;
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
}

@media (max-width: 1024px) {
  .experiences__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .experiences {
    padding: 40px 20px;
    flex-direction: column;
    gap: 20px;

    &__grid {
      grid-template-columns: 1fr;
    }
  }

  .experience-card {
    gap: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 15px;

    &__chevron {
      display: block;
    }

    &__details {
      position: static;
      background: transparent;
      padding: 0;
      transform: none;
      transition: max-height 0.4s ease, opacity 0.3s ease;
      overflow: hidden;
    }

    &__description {
      color: var(--text-primary);
      margin-top: 12px;
    }

    &__link {
      color: var(--text-primary);
      border-bottom-color: var(--text-secondary);
    }

    &.is-active {
      .experience-card__details {
        max-height: 500px;
        opacity: 1;
      }

      .experience-card__chevron {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
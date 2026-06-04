<template>
  <section id="experience" ref="sectionRef" class="experiences">
    <div class="experiences__sidebar">
      <h2 class="experiences__title">{{ t("projects.experiences") }}</h2>

      <!-- Интерактивный таймлайн-прогресс -->
      <div class="experiences__timeline">
        <div class="experiences__timeline-bar" :style="{ '--progress': timelineProgress }"></div>
        <div
            v-for="(item, index) in EXPERIENCES"
            :key="'dot-' + item.company"
            class="experiences__timeline-dot"
            :class="{ 'is-active': activeCompanyIndex >= index }"
        ></div>
      </div>
    </div>

    <div class="experiences__list">
      <div
          v-for="(item, index) in EXPERIENCES"
          :key="item.company"
          class="experience-card"
          :ref="(el) => cardRefs[index] = el as HTMLElement"
          :class="{ 'is-active': activeCompanyIndex === index, 'is-passed': activeCompanyIndex > index }"
      >
        <div class="experience-card__visual">
          <span class="experience-card__year">{{ item.year }}</span>
          <div class="experience-card__dot-mobile"></div>
        </div>

        <div class="experience-card__content">
          <div class="experience-card__main">
            <h3 class="experience-card__role">{{ item.role }}</h3>
            <p class="experience-card__company">{{ item.company }}</p>

            <!-- Стек технологий (Tech Badges) -->
            <div class="experience-card__tags">
              <span v-for="tech in item.skills" :key="tech" class="experience-card__tag">
                {{ tech }}
              </span>
            </div>
          </div>

          <div class="experience-card__details">
            <p class="experience-card__description">{{ t(`projects.${item.descKey}`) }}</p>
            <a :href="item.link" target="_blank" class="experience-card__link">
              {{ t('projects.visit_site') }} ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const activeCompanyIndex = ref<number>(-1);
const sectionRef = ref<HTMLElement | null>(null);
const cardRefs = ref<HTMLElement[]>([]);
let observer: IntersectionObserver | null = null;

const timelineProgress = computed(() => {
  if (activeCompanyIndex.value === -1) return '0%';
  if (window.innerWidth <= 768) return '0%';

  const total = EXPERIENCES.length;
  const progress = (activeCompanyIndex.value / (total - 1)) * 100;
  return `${progress}%`;
});

const EXPERIENCES = [
  { year: '2019 - 2021', role: 'Web Developer', company: 'Chrono', descKey: 'chrono_desc', link: 'https://chrono.tech', skills: ['HTML/CSS', 'JavaScript', 'jQuery', 'PHP'] },
  { year: '2021 - 2022', role: 'Frontend Developer', company: 'Crypton Studio', descKey: 'crypton_desc', link: 'https://crypton.studio', skills: ['Vue.js', 'TypeScript', 'Web3.js'] },
  { year: '2022 - 2023', role: 'Frontend Developer', company: 'Tenzor', descKey: 'tenzor_desc', link: 'https://sbis.ru', skills: ['React', 'Redux', 'RxJS'] },
  { year: '2023', role: 'Frontend Developer', company: 'Anketolog', descKey: 'anketolog_desc', link: 'https://anketolog.ru', skills: ['Vue', 'Pinia', 'Nuxt'] },
  { year: '2023 - 2024', role: 'Frontend Developer', company: 'WSender', descKey: 'wsender_desc', link: 'https://wsender.ru', skills: ['Vue', 'TypeScript', 'Three.js'] },
  { year: '2024 - Present', role: 'Frontend Developer', company: 'EMCD', descKey: 'emcd_desc', link: 'https://emcd.io', skills: ['Vue', 'Pinia', 'TypeScript'] },
] as const;

onMounted(() => {
  if (window.innerWidth > 1024) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = cardRefs.value.indexOf(entry.target as HTMLElement);
          if (index !== -1) {
            activeCompanyIndex.value = index;
          }
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '-10% 0px -10% 0px'
    });

    cardRefs.value.forEach((card) => {
      if (card) observer?.observe(card);
    });
  } else {
    const mobileObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible-mobile');
          mobileObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cardRefs.value.forEach((card) => {
      if (card) mobileObserver.observe(card);
    });
  }
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<style scoped lang="scss">
.experiences {
  display: flex;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 100px 40px;
  background-color: transparent;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--text-primary);

  &__sidebar {
    flex: 0 0 25%;
    position: sticky;
    top: 100px;
    height: calc(100vh - 200px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 60px;
  }

  &__title {
    font-size: 24px;
    font-weight: 400;
    margin: 0;
    letter-spacing: -0.02em;
  }

  &__timeline {
    width: 2px;
    height: 100%;
    max-height: 400px;
    background: var(--text-secondary);
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 12px;
  }

  &__timeline-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--progress);
    transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &__timeline-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--bg-primary);
    border: 2px solid var(--text-secondary);
    position: relative;
    z-index: 2;
    transform: translateX(-4px);
    transition: all 0.3s ease;

    &.is-active {
      background: var(--text-primary);
    }
  }

  &__list {
    flex: 1;
    position: relative;
    padding-top: 20vh;
  }
}

.experience-card {
  display: flex;
  gap: 40px;
  position: relative;
  min-height: 70vh;
  opacity: 0.2;
  will-change: transform, opacity;
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);

  &.is-active {
    opacity: 1;
  }

  &.is-passed {
    opacity: 0.3;
    transform: translateY(-20px);
  }

  &__visual {
    flex: 0 0 80px;
    display: flex;
    justify-content: flex-end;
    padding-top: 4px;
  }

  &__year {
    font-size: 18px;
    color: var(--text-secondary);
    font-weight: 400;
  }

  &__dot-mobile { display: none; }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__role {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
  }

  &__company {
    font-size: 14px;
    color: var(--text-secondary);
    margin: 0;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 12px;
  }

  &__tag {
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 6px;
    background: var(--text-tertiary);
    color: var(--bg-primary);
    border: 1px solid rgba(255, 255, 255, 0.04);
  }

  &__details {
    padding: 0;
    opacity: 1;
    transform: none;
    max-height: 1000px;
    background: transparent;
    border-radius: 0;
    overflow: visible;
  }

  &__description {
    font-size: 13px;
    line-height: 1.6;
    color: var(--text-primary);
    opacity: 0.8;
    margin: 0 0 16px 0;
  }

  &__link {
    font-size: 13px;
    color: var(--acc-color);
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s ease;

    &:hover { opacity: 0.8; }
  }
}

@media (max-width: 1024px) {
  .experiences {
    padding: 60px 20px;
    flex-direction: column;
    gap: 40px;

    &__sidebar {
      position: static;
      height: auto;
      gap: 0;
    }

    &__timeline { display: none; }

    &__list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      padding-top: 0;
    }
  }

  .experience-card {
    min-height: auto;
    flex-direction: column;
    gap: 16px;
    padding: 24px;
    background: var(--bg-secondary);
    border-radius: 12px;
    opacity: 1;

    &.is-passed { transform: none; opacity: 1; }

    &__visual {
      justify-content: flex-start;
      flex-direction: row;
      align-items: center;
      gap: 12px;
    }

    &__content { gap: 12px; }
  }
}

@media (max-width: 768px) {
  .experiences__list {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .experience-card {
    padding: 20px;
    opacity: 0;
    transform: none;

    &.is-visible-mobile {
      opacity: 1;
      transition: opacity 0.4s ease;
    }

    &__visual { position: relative; }

    &__dot-mobile {
      display: block;
      width: 8px;
      height: 8px;
      background: var(--text-secondary);
      border-radius: 50%;
    }

    &__description {
      font-size: 14px;
      line-height: 1.5;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .experience-card {
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
</style>
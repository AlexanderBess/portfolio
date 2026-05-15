<template>
  <section class="skills-section">
    <div
        class="marquee"
        @click="isExpanded = !isExpanded"
        :class="{ 'marquee--active': isExpanded }"
        role="button"
        :aria-expanded="isExpanded"
    >
      <div class="marquee__inner">
        <div v-for="i in 6" :key="i" class="marquee__group">
          <span v-for="skill in skills" :key="skill.name" class="marquee__item">
            {{ skill.name }}
            <span class="marquee__separator">•</span>
          </span>
        </div>
      </div>

      <div class="marquee__hint">
        <span class="marquee__hint-dot"></span>
        {{ isExpanded ? t('skills.hide') : t('skills.show_details') }}
      </div>
    </div>

    <transition name="expand">
      <div v-if="isExpanded" class="skills-details">
        <div v-for="skill in skills" :key="skill.name" class="skills-details__item">
          <div class="skills-details__info">
            <span class="skills-details__name">{{ skill.name }}</span>
            <span class="skills-details__percentage">{{ skill.level }}%</span>
          </div>
          <div class="skills-details__progress-bg">
            <div
                class="skills-details__progress-fill"
                :style="{ width: isExpanded ? skill.level + '%' : '0%' }"
            ></div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface Skill {
  name: string;
  level: number;
}

const { t } = useI18n();
const isExpanded = ref(false);

const skills: Skill[] = [
  { name: 'Vue', level: 95 },
  { name: 'JavaScript', level: 85 },
  { name: 'TypeScript', level: 70 },
  { name: 'SASS', level: 90 },
  { name: 'Three.js', level: 40 },
  { name: 'React', level: 35 },
  { name: 'UI/UX', level: 80 },
  { name: t('skills.communication'), level: 100 },
];
</script>

<style lang="scss" scoped>
.skills-section {
  width: 100%;
  overflow: hidden;
  background: transparent;
}

.marquee {
  position: relative;
  display: flex;
  overflow: hidden;
  user-select: none;
  padding: 32px 0;
  cursor: pointer;
  border-top: 1px solid var(--border-primary);
  border-bottom: 1px solid var(--border-primary);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.02);

    .marquee__item {
      color: var(--text-primary);
    }

    .marquee__hint {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &--active {
    background: var(--bg-surface-soft);
    border-bottom-color: transparent;
  }

  &__inner {
    display: flex;
    width: max-content;
    flex-wrap: nowrap;
    animation: scroll 40s linear infinite;

    &:hover {
      animation-play-state: paused;
    }
  }

  &__group {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  &__item {
    font-size: clamp(24px, 4vw, 30px);
    font-weight: 700;
    text-transform: uppercase;
    white-space: nowrap;
    padding: 0 30px;
    color: var(--text-secondary);
    transition: color 0.3s ease;
    display: flex;
    align-items: center;
    will-change: transform;
  }

  &__separator {
    margin-left: 60px;
    color: var(--text-tertiary);
    opacity: 0.3;
  }

  &__hint {
    position: absolute;
    right: 24px;
    bottom: 12px;
    font-size: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    opacity: 0.6;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 8px;
    transform: translateY(5px);
    transition: all 0.3s ease;

    &-dot {
      width: 6px;
      height: 6px;
      background: var(--text-primary);
      border-radius: 50%;
    }
  }
}

.skills-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 40px;
  padding: 60px 24px;
  background: var(--bg-surface-soft);
  border-bottom: 1px solid var(--border-primary);

  &__item {
    display: flex;
    flex-direction: column;
  }

  &__info {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 12px;
  }

  &__name {
    font-weight: 600;
    font-size: 18px;
    color: var(--text-primary);
  }

  &__percentage {
    color: var(--text-tertiary);
    font-size: 14px;
    font-family: monospace;
  }

  &__progress-bg {
    height: 3px;
    background: var(--border-primary);
    width: 100%;
    overflow: hidden;
  }

  &__progress-fill {
    height: 100%;
    background: var(--text-primary);
    transition: width 1.2s cubic-bezier(0.65, 0, 0.35, 1);
  }
}

.expand-enter-active, .expand-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 1000px;
}

.expand-enter-from, .expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

@keyframes scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (max-width: 768px) {
  .marquee {
    padding: 20px 0;
    &__item { padding: 0 15px; }
    &__separator { margin-left: 30px; }
  }

  .skills-details {
    grid-template-columns: 1fr;
    padding: 30px 20px;
    gap: 24px;
  }
}
</style>
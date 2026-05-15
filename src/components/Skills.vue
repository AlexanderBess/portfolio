<template>
  <section class="skills-section">
    <div class="marquee" @click="isExpanded = !isExpanded" :class="{ 'marquee--active': isExpanded }">
      <div class="marquee__inner">
        <div v-for="i in 4" :key="i" class="marquee__group">
          <span v-for="skill in skills" :key="skill.name" class="marquee__item">
            {{ skill.name }}
            <span class="marquee__separator">•</span>
          </span>
        </div>
      </div>
      <div class="marquee__hint">
        {{ isExpanded ? 'Click to hide' : 'Click to see details' }}
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
                :style="{ width: skill.level + '%' }"
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

const t = useI18n().t;

const isExpanded = ref(false);

const skills: Skill[] = [
  { name: 'Vue', level: 95 },
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
  overflow: hidden;
}

.marquee {
  position: relative;
  display: flex;
  overflow: hidden;
  user-select: none;
  padding: 20px 0;
  cursor: pointer;
  border-top: 1px solid var(--border-primary);
  border-bottom: 1px solid var(--border-primary);
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    .marquee__hint { opacity: 1; }
  }

  &__inner {
    display: flex;
    flex-shrink: 0;
    min-width: 100%;
    animation: scroll 30s linear infinite;
  }

  &__group {
    display: flex;
    align-items: center;
    justify-content: space-around;
    min-width: 30%;
  }

  &__item {
    font-size: 24px;
    font-weight: 700;
    text-transform: uppercase;
    white-space: nowrap;
    padding: 0 20px;
    color: var(--text-primary);
  }

  &__separator {
    margin-left: 40px;
    color: var(--text-tertiary);
  }

  &__hint {
    position: absolute;
    right: 20px;
    bottom: 5px;
    font-size: 0.7rem;
    text-transform: uppercase;
    transition: opacity 0.3s ease;
    color: var(--text-secondary);
  }
}

.skills-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  padding: 40px 20px;
  background: var(--border-secondary);

  &__info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  &__name {
    font-weight: 600;
    font-size: 18px;
  }

  &__percentage {
    color: var(--text-primary);
    font-size: 16px;
  }

  &__progress-bg {
    height: 2px;
    background: var(--bg-surface);
    width: 100%;
    overflow: hidden;
  }

  &__progress-fill {
    height: 100%;
    background: var(--text-primary);
    transition: width 1.5s cubic-bezier(0.22, 1, 0.36, 1);
  }
}

@media (max-width: 768px) {
  .marquee {
    padding: 10px 0;

    &__item {
      font-size: 20px;
    }

    &__hint {
      font-size: 10px;
    }
  }
  .skills-details {
    &__name {
      font-size: 16px;
    }
    &__percentage {
      font-size: 14px;
    }
  }
}

@keyframes scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}

.expand-enter-active, .expand-leave-active {
  transition: all 0.5s ease;
  max-height: 500px;
}

.expand-enter-from, .expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-20px);
}
</style>
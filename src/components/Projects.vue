<script setup lang="ts">
const EXPERIENCES = [
  {
    year: '2019',
    role: 'Web Developer',
    company: 'Chrono',
  },
  {
    year: '2021',
    role: 'Frontend Developer',
    company: 'Crypton Studio',
  },
  {
    year: '2022',
    role: 'Frontend Developer',
    company: 'Tenzor',
  },
  {
    year: '2023',
    role: 'Frontend Developer',
    company: 'Anketolog',
  },
  {
    year: '2023',
    role: 'Frontend Developer',
    company: 'WSender',
  },
  {
    year: '2024 - Present',
    role: 'Frontend Developer',
    company: 'EMCD',
  },
] as const;
</script>

<template>
  <section class="experiences">
    <div class="experiences__sidebar">
      <h2 class="experiences__title">{{ $t("projects.experiences") }}</h2>
    </div>

    <div class="experiences__grid">
      <div
          v-for="item in EXPERIENCES"
          :key="item.company"
          class="experience-card"
      >
        <span class="experience-card__year">{{ item.year }}</span>

        <div class="experience-card__content">
          <h3 class="experience-card__role">{{ item.role }}</h3>
          <p class="experience-card__company">{{ item.company }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

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
    flex: 0 0 25%; // Занимает 1/4 ширины
  }

  &__title {
    font-size: 24px;
    font-weight: 400;
    margin: 0;
    color: var(--text-primary);
  }

  &__grid {
    flex: 1;
    display: grid;
    // Создаем 4 колонки, которые сжимаются на мелких экранах
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
  }
}

.experience-card {
  display: flex;
  flex-direction: column;
  gap: 30px; // Расстояние между годом и текстом

  &__year {
    font-size: 20px;
    color: var(--text-secondary);
    font-weight: 400;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__role {
    font-size: 16px;
    font-weight: 400;
    margin: 0;
    color: var(--text-primary);
  }

  &__company {
    font-size: 16px;
    color: var(--text-secondary);
    margin: 0;
  }
}

// Адаптация для планшетов и мобильных устройств
@media (max-width: 1024px) {
  .experiences {
    flex-direction: column;
    gap: 40px;
    padding: 40px 20px;

    &__sidebar {
      width: 100%;
    }

    &__grid {
      width: 100%;
      grid-template-columns: repeat(2, 1fr); // 2 колонки на планшетах
      gap: 40px 20px;
    }
  }
}

@media (max-width: 600px) {
  .experiences__grid {
    grid-template-columns: 1fr; // 1 колонка на мобилках
    gap: 32px;
  }

  .experience-card {
    gap: 12px;
  }
}
</style>
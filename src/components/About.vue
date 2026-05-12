<template>
  <section id="about" class="about">
    <div class="about__container">
        <div class="about__info">
          <h2 class="about__title">
            {{ $t('about.description') }}
          </h2>
          
          <p class="about__description">
            {{ $t('about.passion') }}
          </p>
        </div>
      </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.about {
  padding: 80px 60px;
  background-color: var(--bg-primary);

  &__title {
    width: 100%;
    font-family: "Geist", "Geist Placeholder", sans-serif;
    font-size: 30px;
    font-weight: 500;
    color: var(--light-secondary);
  }

  &__info {
    display: flex;
    gap: 50px;
    width: 100%;
  }

  &__description {
    width: 100%;
    font-size: 18px;
    color: theme-color('light-text-secondary');
    line-height: 1.75;
  }
}

@media (max-width: 1200px) {
  .about {
    padding: 40px 40px;

    &__info {
      flex-direction: column;
      gap: 20px;
    }
  }
}
</style>

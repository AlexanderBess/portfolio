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
      <img src="@/assets/images/PNG/me.png" alt="Alex Bess" class="about__image">
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

  &__container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 50px;
  }

  &__image {
    max-width: 400px;
    height: fit-content;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.8s ease-out forwards;
  }

  &__title {
    width: 100%;
    font-family: "Geist", "Geist Placeholder", sans-serif;
    font-size: 30px;
    font-weight: 500;
    color: var(--light-secondary);
  }

  &__info {
    display: flex;
    flex-direction: column;
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1200px) {
  .about {
    padding: 40px 40px;

    &__info {
      gap: 20px;
    }
  }
}
</style>

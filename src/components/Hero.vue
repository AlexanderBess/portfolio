<template>
  <section class="hero">
    <div class="hero__container">
      <div class="hero__content">
        <h1 class="hero__title">
          {{ $t('hero.title') }}
        </h1>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.hero {
  display: flex;
  align-items: start;
  justify-content: center;
  background: linear-gradient(to bottom, var(--primary-50), white);

  &__container {
    margin: 0 auto;
    padding: 0 1.5rem;
    text-align: center;
  }

  &__content {
    animation: fadeInUp 0.8s ease-out;
  }

  &__title {
    width: 100%;
    height: auto;
    font-weight: 600;
    font-style: normal;
    font-family: "Space Grotesk", "Space Grotesk Placeholder", sans-serif;
    color: var(--light-primary);
    font-size: clamp(4rem, 10vw, 12rem);
    letter-spacing: clamp(-2px, -1vw, -8px);
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
    display: block;

    @media (max-width: 768px) {
      font-size: clamp(3rem, 10vw, 8rem);
      letter-spacing: clamp(-1px, -0.5vw, -4px);
    }

    @media (max-width: 480px) {
      font-size: clamp(2rem, 10vw, 5rem);
      letter-spacing: clamp(-0.5px, -0.3vw, -2px);
    }
  }
}
</style>

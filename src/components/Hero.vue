<template>
  <section id="home" class="hero">
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

  &__subtitle {
    font-size: 1.25rem;
    color: #6b7280;
    margin-bottom: 2rem;
    max-width: 42rem;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;

    @media (min-width: 768px) {
      font-size: 1.5rem;
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 3rem;

    @media (min-width: 640px) {
      flex-direction: row;
    }
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;

    &--primary {
      background-color: var(--primary-600);
      color: white;

      &:hover {
        background-color: var(--primary-700);
      }
    }

    &--secondary {
      border: 2px solid var(--primary-600);
      color: var(--primary-600);
      background-color: transparent;

      &:hover {
        background-color: var(--primary-50);
      }
    }
  }

  &__social {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
  }

  &__social-link {
    color: #9ca3af;
    transition: color 0.3s ease;

    &:hover {
      color: var(--primary-600);
    }
  }

  &__social-icon {
    width: 1.5rem;
    height: 1.5rem;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

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
        <div class="about__image-wrapper">
          <image-card
            :background-image-url="forestImage"
            :foreground-image-url="meImage"
            alt-text="Alex Bess"
            :text="$t('about.img-text')"
          />
        </div>
      </div>
  </section>
</template>

<script setup lang="ts">
import ImageCard from "./ImageCard.vue";
import meImage from "@/assets/images/PNG/me.png";
import forestImage from "@/assets/images/PNG/forest.png";
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

  &__image-wrapper {
    width: stretch;
    max-width: 400px;
    height: fit-content;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.8s ease-out forwards;
  }

  &__image {
    padding: 30px;
    border-radius: 12px;
    border: 1px solid var(--text-primary);
    width: stretch;
    max-width: 400px;
    height: fit-content;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.8s ease-out forwards;
  }

  &__title {
    width: 100%;
    font-size: 30px;
    font-weight: 500;
    color: var(--light-secondary);
  }

  &__info {
    font-family: "Geist", "Geist Placeholder", sans-serif;
    display: flex;
    flex-direction: column;
    gap: 50px;
    width: 100%;
  }

  &__description {
    width: 100%;
    font-size: 18px;
    color: var(--light-text-secondary);
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

@media (max-width: 890px) {
  .about {
    &__container {
      flex-direction: column;
      gap: 30px;
    }
  }
}
</style>

<template>
  <div
      class="promo-card"
      :style="{ backgroundImage: `url(${backgroundImageUrl})` }"
  >
    <div class="promo-card__overlay"></div>

    <div class="promo-card__content">
      <img
          class="promo-card__image"
          :src="foregroundImageUrl"
          :alt="altText"
      />

      <div class="promo-card__hover-content">
        <div class="promo-card__label">
          {{ text }}
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  backgroundImageUrl: string
  foregroundImageUrl: string
  altText: string
  text: string
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.promo-card {
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 350px;
  overflow: hidden;
  border-radius: 32px;

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  cursor: pointer;

  &__overlay {
    position: absolute;
    inset: 0;
  }

  &__content {
    position: relative;
    z-index: 2;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
  }

  &__image {
    width: 460px;
    max-width: 70%;

    border-radius: 24px;

    object-fit: cover;

    transition:
        transform 0.4s ease,
        filter 0.4s ease;
  }

  &__hover-content {
    position: absolute;
    inset: 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    opacity: 0;
    visibility: hidden;

    transition:
        opacity 0.35s ease,
        visibility 0.35s ease;
  }

  &__label {
    position: absolute;
    top: 50%;
    left: 50%;

    width: 100%;
    padding: 2px 24px;

    background-color: var(--text-primary);

    color: var(--bg-primary);
    font-size: 18px;
    font-weight: 700;
    text-align: center;

    transform: translate(-50%, -140%);
  }

  &:hover {
    .promo-card__overlay {
      filter: brightness(2);
    }

    .promo-card__image {
      transform: scale(1.2);
    }

    .promo-card__hover-content {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
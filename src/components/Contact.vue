<template>
  <section id="contact" class="contact-morph" ref="target">
    <div
        class="contact-morph__container"
        :class="{ 'contact-morph__container--visible': isVisible }"
    >
      <h2 class="contact-morph__title">{{ t("contact.title") }}</h2>

      <div
          class="contact-morph__wrapper"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
      >
        <div
            class="contact-morph__main"
            :class="{ 'contact-morph__main--split': isHovered }"
        >
          <a
              href="https://t.me/Alex_Sage"
              target="_blank"
              class="contact-morph__button contact-morph__button--left"
          >
            <span class="contact-morph__text contact-morph__text--desktop">
              {{ isHovered ? 'TELEGRAM' : t("contact.first_button") }}
            </span>
            <span class="contact-morph__text contact-morph__text--mobile">
              TELEGRAM
            </span>
          </a>

          <span
              class="contact-morph__middle-text"
              :class="{ 'contact-morph__middle-text--visible': isHovered }"
          >
            {{ t('contact.where_to_start') }}
          </span>

          <a
              href="mailto:alexbessmelcev@gmail.com"
              class="contact-morph__button contact-morph__button--right"
          >
            <span class="contact-morph__text contact-morph__text--desktop">
              {{ isHovered ? 'EMAIL' : t("contact.second_button") }}
            </span>
            <span class="contact-morph__text contact-morph__text--mobile">
              EMAIL
            </span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const isHovered = ref(false);
const isVisible = ref(false);
const target = ref<HTMLElement | null>(null);

onMounted(() => {
  const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true;
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
  );
  if (target.value) observer.observe(target.value);
});
</script>

<style lang="scss" scoped>
.contact-morph {
  padding: 0 20px;
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background: var(--bg-primary);
  overflow: hidden;

  &__container {
    width: 100%;
    max-width: 800px;
    text-align: center;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);

    &--visible {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &__title {
    font-size: clamp(18px, 4vw, 22px);
    font-weight: 500;
    text-transform: uppercase;
    color: var(--text-secondary);
    letter-spacing: 4px;
    margin-bottom: 40px;
  }

  &__wrapper {
    display: inline-block;
    width: 100%;
  }

  &__main {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.6s cubic-bezier(0.85, 0, 0.15, 1);

    @media (min-width: 769px) {
      gap: 0;
      &--split { gap: 40px; }
    }

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 12px;
    }
  }

  &__button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    border: 1px solid var(--border-secondary);
    color: var(--text-primary);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
    letter-spacing: 1px;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

    @media (min-width: 769px) {
      min-width: 200px;
      &--left { border-radius: 100px 0 0 100px; border-right: none; }
      &--right { border-radius: 0 100px 100px 0; }

      .contact-morph__main--split & {
        border-radius: 100px;
        background: var(--text-primary);
        color: var(--bg-primary);
        min-width: 150px;
      }
    }

    @media (max-width: 768px) {
      width: 100%;
      max-width: 340px;
      border-radius: 100px;
      background: var(--bg-surface);
      border-color: var(--border-primary);
    }
  }

  &__text {
    &--mobile {
      display: none;
      @media (max-width: 768px) { display: block; }
    }
    &--desktop {
      display: block;
      @media (max-width: 768px) { display: none; }
    }
  }

  &__middle-text {
    @media (min-width: 769px) {
      width: 0;
      opacity: 0;
      white-space: nowrap;
      transition: all 0.6s ease;
      overflow: hidden;
      color: var(--text-tertiary);

      &--visible {
        width: 160px;
        opacity: 1;
        margin: 0 10px;
      }
    }

    @media (max-width: 768px) {
      display: block;
      margin: 10px 0;
      font-size: 0.8rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }
}
</style>
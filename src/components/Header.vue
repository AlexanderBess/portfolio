<template>
  <header class="header">
    <nav class="header__nav">
      <div class="header__container">
        <!-- Brand Name -->
        <div class="header__brand">
          AB©
        </div>
        
        <!-- Navigation Links -->
        <div class="header__nav-list">
          <a href="#home" class="header__nav-link">{{ t('header.nav.home') }}</a>
          <a href="#about" class="header__nav-link">{{ t('header.nav.about') }}</a>
          <a href="#projects" class="header__nav-link">{{ t('header.nav.projects') }}</a>
        </div>

        <!-- Right Side Controls -->
        <div class="header__controls">
          <!-- Theme Toggle Button -->
          <button
            @click="toggleTheme"
            class="header__theme-toggle"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <svg 
              class="header__theme-icon"
              :class="{ 'header__theme-icon--sun': isDark, 'header__theme-icon--moon': !isDark }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <template v-if="isDark">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </template>
              <template v-else>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </template>
            </svg>
          </button>

          <!-- Language Switcher -->
          <div class="header__lang-switcher">
            <button
              @click="changeLanguage('en')"
              :class="['header__lang-btn', { 'header__lang-btn--active': locale === 'en' }]"
            >
              EN
            </button>
            <button
              @click="changeLanguage('ru')"
              :class="['header__lang-btn', { 'header__lang-btn--active': locale === 'ru' }]"
            >
              RU
            </button>
          </div>

          <!-- Mobile Menu Toggle -->
          <button
            @click="toggleMobileMenu"
            class="header__mobile-toggle"
          >
            <svg class="header__mobile-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="isMobileMenuOpen" class="header__mobile-menu">
        <a href="#home" class="header__mobile-link">{{ t('header.nav.home') }}</a>
        <a href="#about" class="header__mobile-link">{{ t('header.nav.about') }}</a>
        <a href="#projects" class="header__mobile-link">{{ t('header.nav.projects') }}</a>
        
        <!-- Mobile Language Switcher -->
        <div class="header__mobile-lang">
          <button
            @click="changeLanguage('en')"
            :class="['header__mobile-lang-btn', { 'header__mobile-lang-btn--active': locale === 'en' }]"
          >
            EN
          </button>
          <button
            @click="changeLanguage('ru')"
            :class="['header__mobile-lang-btn', { 'header__mobile-lang-btn--active': locale === 'ru' }]"
          >
            RU
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const isMobileMenuOpen = ref(false)
const isDark = ref(true)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const changeLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
  isMobileMenuOpen.value = false
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  
  // Apply theme using data attribute for CSS custom properties
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.classList.add('dark')
    // Add dark class to portfolio block
    const portfolioElement = document.querySelector('.portfolio')
    if (portfolioElement) {
      portfolioElement.classList.add('portfolio--dark')
      portfolioElement.classList.remove('portfolio--light')
    }
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
    document.documentElement.classList.remove('dark')
    // Add light class to portfolio block
    const portfolioElement = document.querySelector('.portfolio')
    if (portfolioElement) {
      portfolioElement.classList.add('portfolio--light')
      portfolioElement.classList.remove('portfolio--dark')
    }
  }
}

// Initialize theme on mount
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  // Default to dark theme if no saved theme or if saved theme is not 'light'
  if (savedTheme === 'light') {
    isDark.value = false
    document.documentElement.setAttribute('data-theme', 'light')
    document.documentElement.classList.remove('dark')
    // Set portfolio to light theme
    const portfolioElement = document.querySelector('.portfolio')
    if (portfolioElement) {
      portfolioElement.classList.add('portfolio--light')
      portfolioElement.classList.remove('portfolio--dark')
    }
  } else {
    // Default to dark theme
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.classList.add('dark')
    // Set portfolio to dark theme
    const portfolioElement = document.querySelector('.portfolio')
    if (portfolioElement) {
      portfolioElement.classList.add('portfolio--dark')
      portfolioElement.classList.remove('portfolio--light')
    }
  }
})
</script>

<style lang="scss">
// Import variables, utilities and SASS modules
@use 'sass:map';
@use '../styles/variables' as *;
@use '../styles/utilities' as *;

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: z('fixed');
  background: var(--bg-surface);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border-primary);
  transition: var(--theme-transition);

  &__nav {
    max-width: map.get($breakpoints, 'wide');
    margin: 0 auto;
    padding: 0 spacing('lg');
    padding-top: spacing('md');
    padding-bottom: spacing('md');
  }

  &__container {
    @include flex-between();
  }

  &__brand {
    width: 160px;
    font-size: font-size('xl');
    font-weight: 700;
    color: var(--text-primary);
    transition: var(--theme-transition);
  }

  &__nav-list {
    display: none;
    align-items: center;
    gap: spacing('xl');

    @include tablet-up {
      display: flex;
    }
  }

  &__nav-link {
    color: var(--text-secondary);
    text-decoration: none;
    transition: var(--theme-transition);

    &:hover {
      color: var(--text-primary);
    }
  }

  &__controls {
    @include flex-center();
    gap: spacing('md');
  }

  &__theme-toggle {
    padding: spacing('sm');
    border-radius: radius('md');
    background: transparent;
    border: none;
    cursor: pointer;
    transition: var(--theme-transition);

    &:hover {
      background-color: var(--bg-secondary);
    }
  }

  &__theme-icon {
    width: 24px;
    height: 24px;
    transition: var(--theme-transition);

    &--sun {
      color: var(--sun-color);
    }

    &--moon {
      color: var(--moon-color);
    }
  }

  &__lang-switcher {
    display: none;
    align-items: center;
    gap: spacing('sm');
    border-left: 1px solid var(--border-secondary);
    padding-left: spacing('lg');
    transition: var(--theme-transition);

    @include tablet-up {
      display: flex;
    }
  }

  &__lang-btn {
    padding: spacing('xs') spacing('sm');
    font-size: font-size('sm');
    border-radius: radius('sm');
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--theme-transition);

    &:hover {
      color: var(--text-primary);
    }

    &--active {
      background-color: var(--accent-primary);
      color: var(--text-primary);
    }
  }

  &__mobile-toggle {
    display: block;
    padding: spacing('sm');
    border-radius: radius('md');
    background: transparent;
    border: none;
    cursor: pointer;
    transition: var(--theme-transition);

    @include tablet-up {
      display: none;
    }

    &:hover {
      background-color: var(--bg-secondary);
    }
  }

  &__mobile-icon {
    width: 24px;
    height: 24px;
    color: var(--text-secondary);
    transition: var(--theme-transition);
  }

  &__divider {
    margin-top: spacing('md');
    border-bottom: 1px solid var(--border-primary);
    transition: var(--theme-transition);
  }

  &__mobile-menu {
    display: block;
    margin-top: spacing('md');
    padding-bottom: spacing('md');
    @include flex-column();
    gap: spacing('sm');

    @include tablet-up {
      display: none;
    }
  }

  &__mobile-link {
    display: block;
    padding: spacing('sm') 0;
    color: var(--text-secondary);
    text-decoration: none;
    transition: var(--theme-transition);

    &:hover {
      color: var(--text-primary);
    }
  }

  &__mobile-lang {
    @include flex-center();
    gap: spacing('sm');
    padding-top: spacing('md');
    border-top: 1px solid var(--border-primary);
    transition: var(--theme-transition);
  }

  &__mobile-lang-btn {
    padding: spacing('xs') spacing('sm');
    font-size: font-size('sm');
    border-radius: radius('sm');
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--theme-transition);

    &:hover {
      color: var(--text-primary);
    }

    &--active {
      background-color: var(--accent-primary);
      color: var(--text-primary);
    }
  }
}
</style>

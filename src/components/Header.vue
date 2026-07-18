<template>
  <header class="header">
    <nav class="header__nav" :aria-label="t('header.a11y.mainNav')">
      <div class="header__container">
        <!-- Brand Name -->
        <div class="header__brand">
          AB©
        </div>
        
        <!-- Mode Switcher: desktop status variant (center) -->
        <ModeSwitcher variant="status" />


        <!-- Right Side Controls -->
        <div class="header__controls">
          <!-- Mode Switcher: mobile icon variant (mode / theme / menu row) -->
          <ModeSwitcher variant="icon" />

          <!-- Theme Toggle Button -->
          <button
            @click="toggleTheme"
            class="header__theme-toggle"
            :title="isDark ? t('header.a11y.lightMode') : t('header.a11y.darkMode')"
            :aria-label="isDark ? t('header.a11y.lightMode') : t('header.a11y.darkMode')"
            :aria-pressed="isDark"
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
              :aria-pressed="locale === 'en'"
              aria-label="Switch to English"
              lang="en"
            >
              EN
            </button>
            <button
              @click="changeLanguage('ru')"
              :class="['header__lang-btn', { 'header__lang-btn--active': locale === 'ru' }]"
              :aria-pressed="locale === 'ru'"
              aria-label="Переключить на русский"
              lang="ru"
            >
              RU
            </button>
          </div>

          <!-- Mobile Menu Toggle -->
          <button
            @click="toggleMobileMenu"
            class="header__mobile-toggle"
            :aria-label="isMobileMenuOpen ? t('header.a11y.closeMenu') : t('header.a11y.openMenu')"
            :aria-expanded="isMobileMenuOpen"
            aria-controls="mobile-menu"
          >
            <svg class="header__mobile-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="isMobileMenuOpen" id="mobile-menu" class="header__mobile-menu">
        <a href="#home" class="header__mobile-link" @click="onNavLinkClick">{{ t('header.nav.home') }}</a>
        <a href="#experience" class="header__mobile-link" @click="onNavLinkClick">{{ t('header.nav.experience') }}</a>
        <a href="#contact" class="header__mobile-link" @click="onNavLinkClick">{{ t('header.nav.contact') }}</a>
        
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
import ModeSwitcher from './ModeSwitcher.vue'
import { useViewMode } from '@/composables/useViewMode'

// --- GLOBAL APP STATE ---
const { t, locale } = useI18n()
const { setMode } = useViewMode()
const isMobileMenuOpen = ref(false)
const isDark = ref(true)

/**
 * MOBILE NAVIGATION
 * Handlers for toggling the responsive menu overlay.
 */
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

/** Anchor targets live in resume mode — switch back before the browser scrolls. */
const onNavLinkClick = () => {
  setMode('resume')
  isMobileMenuOpen.value = false
}

/**
 * INTERNATIONALIZATION (i18n)
 * Switches app language and persists the choice in LocalStorage.
 */
const changeLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
  document.documentElement.lang = lang // Keep <html lang> in sync for SR/SEO
  isMobileMenuOpen.value = false // Auto-close menu after selection
}

/**
 * THEME ENGINE
 * Orchestrates theme switching across different layers:
 * 1. Vue reactive state (isDark)
 * 2. LocalStorage persistence
 * 3. Native DOM attributes (data-theme)
 * 4. Specific component class overrides
 */
const toggleTheme = () => {
  isDark.value = !isDark.value
  const themeMode = isDark.value ? 'dark' : 'light'

  localStorage.setItem('theme', themeMode)

  // Update root element for global CSS variables access
  document.documentElement.setAttribute('data-theme', themeMode)
  document.documentElement.classList.toggle('dark', isDark.value)

  // --- PORTFOLIO-SPECIFIC THEME SYNC ---
  // Ensuring the portfolio block receives proper styling context
  const portfolioElement = document.querySelector('.portfolio')
  if (portfolioElement) {
    portfolioElement.classList.toggle('portfolio--dark', isDark.value)
    portfolioElement.classList.toggle('portfolio--light', !isDark.value)
  }
}

/**
 * INITIALIZATION (Hydration)
 * Restores user preferences from LocalStorage upon component mount.
 */
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')

  // Logic defaults to 'dark' if no preference is found
  if (savedTheme === 'light') {
    isDark.value = false
    document.documentElement.setAttribute('data-theme', 'light')
    document.documentElement.classList.remove('dark')

    const portfolioElement = document.querySelector('.portfolio')
    if (portfolioElement) {
      portfolioElement.classList.add('portfolio--light')
    }
  } else {
    // Default or Dark preference
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.classList.add('dark')

    const portfolioElement = document.querySelector('.portfolio')
    if (portfolioElement) {
      portfolioElement.classList.add('portfolio--dark')
    }
  }
})
</script>

<style lang="scss">
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
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--chip-bg);
    border: 1px solid var(--card-border);
    cursor: pointer;
    transition: border-color 0.3s ease, background-color 0.3s ease, transform 0.2s ease;

    &:hover {
      border-color: var(--card-border-hover);
      background-color: var(--card-bg);
    }

    &:active {
      transform: scale(0.92);
    }
  }

  &__theme-icon {
    width: 20px;
    height: 20px;
    transition: var(--theme-transition);

    &--sun {
      color: var(--sun-color);
    }

    &--moon {
      color: var(--moon-color);
    }
  }

  // Monochrome track + pill, matching the ModeSwitcher aesthetic
  &__lang-switcher {
    display: none;
    align-items: center;
    gap: 2px;
    padding: 3px;
    border: 1px solid #dededf;
    border-radius: 999px;
    background: #f0f0f2;
    transition: var(--theme-transition);

    @include tablet-up {
      display: flex;
    }

    [data-theme='dark'] & {
      background: #171717;
      border-color: #262626;
    }
  }

  &__lang-btn {
    padding: 4px 12px;
    font-size: font-size('sm');
    font-weight: 500;
    border-radius: 999px;
    background: transparent;
    border: 1px solid transparent;
    color: #8a8a93;
    cursor: pointer;
    transition: color 150ms ease-out, background-color 150ms ease-out, border-color 150ms ease-out;

    &:hover {
      color: #52525b;
    }

    &--active,
    &--active:hover {
      background: #ffffff;
      border-color: #e6e6e8;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      color: #18181b;
    }

    [data-theme='dark'] & {
      color: #737373;

      &:hover {
        color: #d4d4d4;
      }

      &--active,
      &--active:hover {
        background: #000000;
        border-color: #262626;
        box-shadow: none;
        color: #ffffff;
      }
    }
  }

  &__mobile-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--chip-bg);
    border: 1px solid var(--card-border);
    cursor: pointer;
    transition: border-color 0.3s ease, background-color 0.3s ease;

    &:hover {
      border-color: var(--card-border-hover);
      background-color: var(--card-bg);
    }

    @include tablet-up {
      display: none;
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
      background-color: var(--bg-secondary);
      color: var(--text-primary);
    }
  }
}
</style>

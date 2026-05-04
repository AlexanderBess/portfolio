<template>
  <header class="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200">
    <nav class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="text-xl font-bold text-gray-800">
          {{ $t('header.name') }}
        </div>
        
        <div class="hidden md:flex items-center space-x-8">
          <a href="#home" class="text-gray-600 hover:text-primary-600 transition-colors">{{ $t('header.nav.home') }}</a>
          <a href="#about" class="text-gray-600 hover:text-primary-600 transition-colors">{{ $t('header.nav.about') }}</a>
          <a href="#projects" class="text-gray-600 hover:text-primary-600 transition-colors">{{ $t('header.nav.projects') }}</a>
          <a href="#contact" class="text-gray-600 hover:text-primary-600 transition-colors">{{ $t('header.nav.contact') }}</a>
          
          <!-- Language Switcher -->
          <div class="flex items-center space-x-2 border-l border-gray-300 pl-6">
            <button
              @click="changeLanguage('en')"
              :class="['px-2 py-1 text-sm rounded transition-colors', locale === 'en' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-primary-600']"
            >
              EN
            </button>
            <button
              @click="changeLanguage('ru')"
              :class="['px-2 py-1 text-sm rounded transition-colors', locale === 'ru' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-primary-600']"
            >
              RU
            </button>
          </div>
        </div>

        <div class="flex items-center space-x-4 md:hidden">
          <!-- Mobile Language Switcher -->
          <div class="flex items-center space-x-1">
            <button
              @click="changeLanguage('en')"
              :class="['px-2 py-1 text-xs rounded transition-colors', locale === 'en' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-primary-600']"
            >
              EN
            </button>
            <button
              @click="changeLanguage('ru')"
              :class="['px-2 py-1 text-xs rounded transition-colors', locale === 'ru' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-primary-600']"
            >
              RU
            </button>
          </div>
          
          <button
            @click="toggleMobileMenu"
            class="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden mt-4 pb-4 space-y-2">
        <a href="#home" class="block py-2 text-gray-600 hover:text-primary-600 transition-colors">{{ $t('header.nav.home') }}</a>
        <a href="#about" class="block py-2 text-gray-600 hover:text-primary-600 transition-colors">{{ $t('header.nav.about') }}</a>
        <a href="#projects" class="block py-2 text-gray-600 hover:text-primary-600 transition-colors">{{ $t('header.nav.projects') }}</a>
        <a href="#contact" class="block py-2 text-gray-600 hover:text-primary-600 transition-colors">{{ $t('header.nav.contact') }}</a>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const changeLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
  isMobileMenuOpen.value = false
}
</script>

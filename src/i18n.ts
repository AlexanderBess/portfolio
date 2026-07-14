import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ru from './locales/ru.json'

const savedLocale = localStorage.getItem('locale') || 'en'

// Keep <html lang> in sync with the active locale (SR pronunciation, SEO)
document.documentElement.lang = savedLocale

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    ru
  }
})

export default i18n

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import i18n from './i18n'
import { vReveal } from './directives/reveal'
import '@/assets/main.css'
import '@/styles/main.scss'

const routes = [
  { path: '/', component: Home }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.use(i18n)
app.directive('reveal', vReveal)
app.mount('#app')

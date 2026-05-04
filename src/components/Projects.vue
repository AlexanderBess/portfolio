<template>
  <section id="projects" class="py-20 bg-gray-50">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">{{ $t('projects.title') }}</h2>
        <div class="w-20 h-1 bg-primary-600 mx-auto"></div>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="project in projects" 
          :key="project.id"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div class="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <div class="text-white text-center p-4">
              <h3 class="text-2xl font-bold mb-2">{{ project.title }}</h3>
            </div>
          </div>
          
          <div class="p-6">
            <p class="text-gray-600 mb-4">{{ project.description }}</p>
            
            <div class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="tech in project.technologies" 
                :key="tech"
                class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
              >
                {{ tech }}
              </span>
            </div>
            
            <div class="flex gap-4">
              <a 
                :href="project.liveUrl" 
                target="_blank"
                class="flex-1 text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {{ $t('projects.liveDemo') }}
              </a>
              <a 
                :href="project.githubUrl" 
                target="_blank"
                class="flex-1 text-center px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                {{ $t('projects.github') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  liveUrl: string
  githubUrl: string
}

const projects: Project[] = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'Полнофункциональная платформа электронной коммерции с панелью администратора, корзиной покупок и системой оплаты.',
    technologies: ['Vue.js', 'TypeScript', 'Node.js', 'MongoDB', 'Stripe'],
    liveUrl: 'https://example-ecommerce.com',
    githubUrl: 'https://github.com/username/ecommerce-platform'
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'Приложение для управления задачами с drag-and-drop интерфейсом, реальным временем совместной работы и уведомлениями.',
    technologies: ['React', 'TypeScript', 'Express', 'PostgreSQL', 'Socket.io'],
    liveUrl: 'https://example-tasks.com',
    githubUrl: 'https://github.com/username/task-manager'
  },
  {
    id: 3,
    title: 'Weather Dashboard',
    description: 'Интерактивная панель погоды с прогнозами, картами и детальной метеорологической информацией для разных городов.',
    technologies: ['Vue.js', 'Tailwind CSS', 'OpenWeather API', 'Chart.js'],
    liveUrl: 'https://example-weather.com',
    githubUrl: 'https://github.com/username/weather-dashboard'
  },
  {
    id: 4,
    title: 'Social Media Analytics',
    description: 'Платформа для аналитики социальных сетей с визуализацией данных, отчетами и экспортом в различные форматы.',
    technologies: ['Nuxt.js', 'TypeScript', 'Python', 'Redis', 'D3.js'],
    liveUrl: 'https://example-analytics.com',
    githubUrl: 'https://github.com/username/social-analytics'
  },
  {
    id: 5,
    title: 'Blog Platform',
    description: 'Современная платформа для блогов с markdown редактором, комментариями, тегами и SEO оптимизацией.',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'MDX'],
    liveUrl: 'https://example-blog.com',
    githubUrl: 'https://github.com/username/blog-platform'
  },
  {
    id: 6,
    title: 'Portfolio Generator',
    description: 'Генератор портфолио для разработчиков с настраиваемыми шаблонами, предварительным просмотром и экспортом.',
    technologies: ['Vue.js', 'TypeScript', 'Vite', 'Tailwind CSS'],
    liveUrl: 'https://example-portfolio.com',
    githubUrl: 'https://github.com/username/portfolio-generator'
  }
]
</script>

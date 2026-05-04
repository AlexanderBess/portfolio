<template>
  <section id="about" class="py-20 bg-white">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">{{ $t('about.title') }}</h2>
        <div class="w-20 h-1 bg-primary-600 mx-auto"></div>
      </div>

      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <p class="text-lg text-gray-600 leading-relaxed">
            {{ $t('about.description') }}
          </p>
          
          <p class="text-lg text-gray-600 leading-relaxed">
            {{ $t('about.passion') }}
          </p>

          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="font-semibold text-gray-900 mb-2">{{ $t('about.experience') }}</h3>
              <p class="text-2xl font-bold text-primary-600">3+ года</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="font-semibold text-gray-900 mb-2">{{ $t('about.projectsCount') }}</h3>
              <p class="text-2xl font-bold text-primary-600">15+</p>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <h3 class="text-2xl font-bold text-gray-900 mb-4">{{ $t('about.skills') }}</h3>
          
          <div class="space-y-3">
            <div v-for="skill in skills" :key="skill.name" class="space-y-2">
              <div class="flex justify-between">
                <span class="font-medium text-gray-700">{{ skill.name }}</span>
                <span class="text-sm text-gray-500">{{ skill.level }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  :style="{ width: skill.level + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Skill {
  name: string
  level: number
}

const skills: Skill[] = [
  { name: 'Vue.js / Nuxt.js', level: 90 },
  { name: 'TypeScript', level: 85 },
  { name: 'JavaScript / ES6+', level: 95 },
  { name: 'Node.js / Express', level: 80 },
  { name: 'HTML / CSS / Tailwind', level: 90 },
  { name: 'Git / GitHub', level: 85 },
  { name: 'SQL / MongoDB', level: 75 },
  { name: 'Docker / CI/CD', level: 70 }
]
</script>

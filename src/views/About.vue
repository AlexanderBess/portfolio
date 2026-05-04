<template>
  <div class="min-h-screen pt-16">
    <div class="container mx-auto px-6 py-20">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">{{ $t('about.title') }}</h1>
      
      <div class="prose max-w-none">
        <p class="text-lg text-gray-600 leading-relaxed mb-6">
          Welcome to my portfolio! I'm Alexander Bess, a Full-Stack developer 
          with experience in creating modern web applications.
        </p>
        
        <p class="text-lg text-gray-600 leading-relaxed mb-6">
          My specialization includes frontend development with Vue.js and React, backend development 
          on Node.js, as well as working with databases and DevOps practices.
        </p>
        
        <p class="text-lg text-gray-600 leading-relaxed">
          I'm constantly developing my skills and learning new technologies to create 
          effective and scalable solutions for business.
        </p>
      </div>
      
      <div class="mt-12">
        <router-link 
          to="/" 
          class="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          {{ $t('common.backToHome') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

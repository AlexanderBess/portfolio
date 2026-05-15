<template>
  <div class="portfolio">
    <PhysicBlock />
    <Hero />
    <About />
    <Skills />
    <Projects />
    <Contact />
  </div>
</template>

<script setup lang="ts">
import PhysicBlock from '../components/PhysicBlock.vue'
import Hero from '../components/Hero.vue'
import About from '../components/About.vue'
import Projects from '../components/Projects.vue'
import Contact from '../components/Contact.vue'
import Skills from "@/components/Skills.vue";
</script>

<style lang="scss" scoped>
.portfolio {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>


<template>
  <div class="portfolio">
    <PhysicBlock />
    <BentoShowcase />
    <ExperienceTimeline />
    <ProjectsShowcase />
    <ContactSection />
  </div>
</template>

<script setup lang="ts">
import PhysicBlock from '../components/PhysicBlock.vue'
import BentoShowcase from '../components/bento/BentoShowcase.vue'
import ExperienceTimeline from '../components/bento/ExperienceTimeline.vue'
import ProjectsShowcase from '../components/bento/ProjectsShowcase.vue'
import ContactSection from '../components/bento/ContactSection.vue'
</script>

<style lang="scss" scoped>
.portfolio {
  display: flex;
  flex-direction: column;
}
</style>


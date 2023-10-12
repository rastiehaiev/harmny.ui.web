<template>
  <app-side-bar></app-side-bar>
  <app-bread-crumbs></app-bread-crumbs>
  <section class="app-content">
    <div class="app-content__main">
      <NotImplementedView>
        The <HyMagentaText>Goals</HyMagentaText> page is where you can define your long-term objectives and aspirations.
        It's an essential tool for setting, tracking, and achieving your personal and professional goals.
        Whether you want to improve your fitness, learn a new skill, or achieve a career milestone, the Goal page allows you to plan and monitor your progress.
        You can break down your goals into actionable steps, create milestones, and visualize your journey towards success.
      </NotImplementedView>
    </div>
  </section>
</template>

<script setup>
import NotImplementedView from '@/components/basic/NotImplementedView.vue'
import HyMagentaText from '@/components/basic/elements/HyMagentaText.vue'
</script>

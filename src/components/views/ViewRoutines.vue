<template>
  <app-side-bar></app-side-bar>
  <app-bread-crumbs></app-bread-crumbs>
  <section class="app-content">
    <div class="app-content__main">
      <NotImplementedView>
        The <HyMagentaText>Routines</HyMagentaText> page is designed to help you organize your
        activities into sets (or routines). With routines, you can streamline your productivity by
        creating predefined sequences of activities that you frequently perform. For example, you
        can create a morning routine that includes activities like meditation, exercise, and
        planning your day. These routines can serve as templates for your daily schedules, making it
        easy to stay on track and ensure you're making the most of your time.
      </NotImplementedView>
    </div>
  </section>
</template>

<script setup>
import NotImplementedView from '@/components/basic/NotImplementedView.vue'
import HyMagentaText from '@/components/basic/elements/HyMagentaText.vue'
</script>

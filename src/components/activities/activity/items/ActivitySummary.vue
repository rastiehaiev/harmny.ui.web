<template>
  <section class="activity-tracking-section">
    <activity-tracking-card></activity-tracking-card>
  </section>
</template>

<script>
import ActivityTrackingCard from '@/components/activities/activity/ActivityTrackingCard.vue'

export default {
  name: 'activity-summary',
  components: { ActivityTrackingCard },
}
</script>

<style scoped>
.activity-tracking-section {
  display: flex;
  width: 100%;
  justify-content: center;
}

@media only screen and (min-width: 60rem) {
  .activity-tracking-section {
    justify-content: left;
  }
}
</style>

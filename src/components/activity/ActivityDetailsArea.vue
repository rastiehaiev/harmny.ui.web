<template>
  <section class="activity-section">
    <ViewActivity
      :key="currentActivity.id"
      v-if="activityType === 'activity'"
      :current-activity="currentActivity"
    />
    <ViewActivityGroup v-else-if="activityType === 'activity-group'" />
    <ViewActivitiesSummary v-else-if="activityType === 'activities'" />
  </section>
</template>

<script>
import ViewActivity from '@/components/activity/views/ViewActivity.vue'
import ViewActivityGroup from '@/components/activity/views/ViewActivityGroup.vue'
import ViewActivitiesSummary from '@/components/activity/views/ViewActivitiesSummary.vue'

export default {
  components: { ViewActivity, ViewActivityGroup, ViewActivitiesSummary },
  data() {
    return {
      activityType: undefined,
      currentActivity: undefined,
    }
  },
  methods: {
    updateCurrentActivity() {
      if (this.activitiesMap !== undefined) {
        const activityId = this.$route.params.activityId
        if (activityId) {
          this.currentActivity = this.activitiesMap?.get(activityId)
        } else {
          this.currentActivity = undefined
        }
        let activityType = 'activities'
        if (this.currentActivity) {
          if (this.currentActivity.group) {
            activityType = 'activity-group'
          } else {
            activityType = 'activity'
          }
        }
        this.activityType = activityType
      }
    },
  },
  computed: {
    activitiesMap() {
      return this.$store.getters['activities/activitiesMap']
    },
  },
  watch: {
    $route() {
      this.updateCurrentActivity()
    },
    activitiesMap() {
      this.updateCurrentActivity()
    },
  },
  beforeMount() {
    this.updateCurrentActivity()
  },
}
</script>

<style scoped>
.activity-section {
  flex-grow: 10;
  display: flex;
  flex-direction: column;
}
</style>

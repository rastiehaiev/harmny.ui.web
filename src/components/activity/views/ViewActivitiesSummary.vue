<template>
  <div></div>
</template>

<script>
export default {
  name: 'activities-dashboard',
  methods: {
    getActivityGroupsCount() {
      if (!this.activitiesMap) {
        return 0
      }
      return [...this.activitiesMap].filter(([, activity]) => activity.group).length
    },
    getActivitiesCount() {
      if (!this.activitiesMap) {
        return 0
      }
      return [...this.activitiesMap].filter(([, activity]) => !activity.group).length
    },
  },
  computed: {
    activitiesMap() {
      return this.$store.getters['activities/activitiesMap']
    },
  },
}
</script>

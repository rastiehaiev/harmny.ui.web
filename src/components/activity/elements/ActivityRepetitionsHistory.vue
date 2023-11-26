<template>
  <div v-if="this.lastActivityRepetitionsLoaded === false" class="activity-repetitions-history__loading">
    <w-progress circle color="yellow" bg-color="cyan"></w-progress>
  </div>
  <section v-else-if="this.lastActivityRepetitions?.length > 0" class="activity-repetitions-history-section">
    <header>Latest launches</header>
    <ul class="activity-repetitions-history-items">
      <li class="activity-repetitions-history-item" :key="activityRepetition.id" v-for="activityRepetition in lastActivityRepetitions">
        <div class="activity-repetitions-history-item__info">
          <span class="activity-repetitions-history-item__key">Started at</span>: {{ toHumanReadableDate(activityRepetition.started_at) }}<br>
          <span class="activity-repetitions-history-item__key">Duration</span>: {{ toHumanReadableDuration(activityRepetition.time_spent_ms) }}<br>
          <span v-if="!!activityRepetition.count">
          <span class="activity-repetitions-history-item__key">Count</span>: {{ activityRepetition.count }}<br>
        </span>
        </div>
        <div class="activity-repetitions-history-item__close-area">
          <w-icon @click.prevent="deleteActivityRepetition(activityRepetition.id)">mdi mdi-close</w-icon>
        </div>
      </li>
    </ul>
  </section>
  <div v-else class="activity-repetitions-history__empty">
    There are no launches yet<br>
    Press 'Launch' button to start your activity
  </div>
</template>

<script>

import timeUtils from '@/utils/time-utils'
export default {
  props: ['currentActivity', 'version'],
  emits: ['onActivityRepetitionDeleted'],
  data() {
    return {
      lastActivityRepetitions: undefined,
      lastActivityRepetitionsLoaded: false,
    }
  },
  methods: {
    loadLastActivityRepetitions() {
      const activityId = this.$props.currentActivity.id
      if (activityId) {
        this.$store.dispatch('activities/listActivityRepetitions', { activityId }).then((repetitions) => {
          this.lastActivityRepetitions = repetitions
          this.lastActivityRepetitionsLoaded = true
        }).catch(() => {
          this.lastActivityRepetitions = []
          this.lastActivityRepetitionsLoaded = true
        })
      } else {
        this.lastActivityRepetitions = []
        this.lastActivityRepetitionsLoaded = true
      }
    },
    deleteActivityRepetition(repetitionId) {
      const activityId = this.$props.currentActivity.id
      this.$store.dispatch('activities/deleteActivityRepetition', { activityId, repetitionId }).then(() => {
        this.$emit('onActivityRepetitionDeleted')
      }).catch(() => {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete activity tracking',
          life: 3000,
        })
      })
    },
    toHumanReadableDate(string) {
      return timeUtils.toHumanReadableDate(string)
    },
    toHumanReadableDuration(durationMs) {
      if (!durationMs) {
        return 'n/a'
      }
      return timeUtils.toHumanReadableDuration(durationMs)
    },
  },
  mounted() {
    this.loadLastActivityRepetitions()
  },
  watch: {
    version() {
      this.loadLastActivityRepetitions()
    },
  },
}
</script>

<style scoped>

.activity-repetitions-history__loading {
  min-height: 5rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.activity-repetitions-history__empty {
  color: var(--color-gray-1);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  line-height: 1.5rem;
}

.activity-repetitions-history-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-repetitions-history-item__key {
  font-weight: 400;
}

.activity-repetitions-history-section header {
  color: var(--color-gray-4);
  font-weight: 400;
}

.activity-repetitions-history-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.activity-repetitions-history-item {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  border: 1px solid var(--color-gray-1);
  font-size: 0.8rem;
  width: 100%;
}

.activity-repetitions-history-item__info {
  color: var(--color-gray-4);
}

.activity-repetitions-history-item__close-area {
  color: var(--color-gray-4);
}

.activity-repetitions-history-item__close-area i {
  cursor: pointer;
}
</style>
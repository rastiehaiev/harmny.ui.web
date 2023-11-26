<template>
  <section class="activity-statistics-card-section">
    <ul class="activity-statistics-card-section__list">
      <li>
        <header>
          <span v-if="dataLoaded">{{ statistics.launchesCount }}</span>
          <span v-else>
            <w-progress circle color="yellow" bg-color="cyan"></w-progress>
          </span>
        </header>
        <h4>Launches Total</h4>
      </li>
      <li>
        <header>
          <span v-if="dataLoaded">{{ statistics.timeSpentMsTotal }}</span>
          <span v-else>
            <w-progress circle color="yellow" bg-color="cyan"></w-progress>
          </span>
        </header>
        <h4>Time Spent Total</h4>
      </li>
      <li>
        <header>
          <span v-if="dataLoaded">{{ statistics.repetitionsTotal }}</span>
          <span v-else>
            <w-progress circle color="yellow" bg-color="cyan"></w-progress>
          </span>
        </header>
        <h4>Repetitions Total</h4>
      </li>
      <li>
        <header>
          <span v-if="dataLoaded">{{ statistics.averageTimePerLaunch }}</span>
          <span v-else>
            <w-progress circle color="yellow" bg-color="cyan"></w-progress>
          </span>
        </header>
        <h4>Time / Launch Avg</h4>
      </li>
    </ul>
  </section>
</template>

<script>
import timeUtils from '@/utils/time-utils'

export default {
  props: ['currentActivity', 'version'],
  data() {
    return {
      dataLoaded: false,
      statistics: {
        launchesCount: undefined,
        timeSpentMsTotal: undefined,
        repetitionsTotal: undefined,
        averageTimePerLaunch: undefined,
      },
    }
  },
  methods: {
    requestStatistics() {
      this.$store
        .dispatch('activities/getStatistics', {
          activityId: this.$props.currentActivity.id,
        })
        .then((statistics) => {
          const {
            launches_count: launchesCount,
            time_spent_ms_total: timeSpentMsTotal,
            repetitions_total: repetitionsTotal,
          } = statistics
          this.statistics.launchesCount =
            launchesCount || launchesCount === 0 ? launchesCount : 'n/a'
          this.statistics.timeSpentMsTotal = timeSpentMsTotal
            ? timeUtils.convertDurationMsToTime(timeSpentMsTotal)
            : 'n/a'
          this.statistics.repetitionsTotal =
            repetitionsTotal || repetitionsTotal === 0 ? repetitionsTotal : 'n/a'

          if (timeSpentMsTotal && launchesCount) {
            const averageTimeMs = timeSpentMsTotal / launchesCount
            if (averageTimeMs > 1000) {
              this.statistics.averageTimePerLaunch = timeUtils.convertDurationMsToTime(averageTimeMs)
            } else {
              this.statistics.averageTimePerLaunch = 'n/a'
            }
          } else {
            this.statistics.averageTimePerLaunch = 'n/a'
          }

          this.dataLoaded = true
        })
        .catch(() => {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to get activity statistics',
            life: 3000,
          })
          this.dataLoaded = true
        })
    },
  },
  mounted() {
    this.requestStatistics()
  },
  watch: {
    version() {
      this.requestStatistics()
    },
  },
}
</script>

<style scoped>
.activity-statistics-card-section {
  display: flex;
  align-items: center;
}

.activity-statistics-card-section__list {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  flex-grow: 0;
}

@media only screen and (min-width: 68rem) {
  .activity-statistics-card-section__list {
    flex-wrap: nowrap;
    flex-direction: row;
    gap: 1rem;
    justify-content: space-between;
  }
}

.activity-statistics-card-section__list li {
  border: 1px solid var(--color-gray-2);
  padding: 0.5rem 1.6rem;
  box-shadow: rgba(12, 40, 97, 0.08) 0 4px 6px 0;
}

@media only screen and (min-width: 68rem) {
  .activity-statistics-card-section__list li {
    padding: 1rem 1.6rem;
  }
}

@media only screen and (min-width: 80rem) {
  .activity-statistics-card-section__list li {
    padding: 1rem 2rem;
  }
}

.activity-statistics-card-section__list li header {
  font-size: 1.2rem;
  font-weight: 400;
}

.activity-statistics-card-section__list li h4 {
  font-size: 0.8rem;
}

@media only screen and (min-width: 90rem) {
  .activity-statistics-card-section__list li header {
    font-size: 2rem;
  }
  .activity-statistics-card-section__list li h4 {
    font-size: 1rem;
  }
}
</style>

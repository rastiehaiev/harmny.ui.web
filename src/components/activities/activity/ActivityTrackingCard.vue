<template>
  <form v-if="activityDataLoaded" class="activity-tracking__form">
    <div class="activity-tracking__form--section-group">
      <section class="activity-tracking__form--section">
        <div class="activity-tracking-card__row activity-tracking__row--duration">
          <span class="p-float-label">
            <p-calendar
              v-model="duration"
              input-id="activity-tracking__form--duration"
              time-only
              show-seconds
              :manual-input="false"
              :disabled="timerOn"
              :min-date="atMidnightInDays(0)"
              :max-date="atMidnightInDays(2)"
            />
            <label for="activity-tracking__form--duration">Duration</label>
          </span>
          <p-button
            v-if="!timerOn"
            @click.prevent="startTimer()"
            icon="pi pi-play"
            severity="success"
            outlined
            aria-label="Start"
          />
          <p-button
            v-else
            @click.prevent="pauseTimer()"
            icon="pi pi-pause"
            severity="warning"
            outlined
            aria-label="Pause"
          />
        </div>

        <div class="activity-tracking-card__row">
          <span class="p-float-label">
            <p-calendar
              v-model="startedAt"
              input-id="activity-tracking__form--started_at"
              show-button-bar
              show-time
              :disabled="timerOn"
              :manual-input="false"
              :max-date="atMidnightInDays(1)"
            />
            <label for="activity-tracking__form--started_at">Started at</label>
          </span>
        </div>

        <div class="activity-tracking-card__row activity-tracking-card__count-area">
          <span class="p-float-label">
            <p-input-number
              v-model.trim="count"
              input-id="activity-tracking__form--count"
              :disabled="timerOn"
              :min="0"
              :max="1000000000"
              :input-props="{ autocomplete: 'off' }"
              :pt="{
                input: { class: 'activity-tracking-card__input' },
              }"
            />
            <label for="activity-tracking__form--count">Count</label>
          </span>
          <div class="activity-tracking-card__count-additions-area">
            <w-tag
              v-for="num in [1, 2, 5, 10, 20]"
              @click.prevent="addToCount(num)"
              :key="num"
              :class="{'activity-tracking-card__increment-disabled': timerOn}"
              color="black"
              shadow
              bg-color="light-green-light5"
            >+{{ num }}
            </w-tag>
          </div>
        </div>
        <div class="activity-tracking-card__show-more-area">
          <a @click.prevent="toggleMoreOptionDisplayed" v-if="moreOptionsDisplayed" href="#">
            Show less properties
          </a>
          <a @click.prevent="toggleMoreOptionDisplayed" v-else href="#">
            Show more properties
          </a>
        </div>
      </section>
      <section v-if="moreOptionsDisplayed" class="activity-tracking__form--section">
        <div class="activity-tracking-card__row">
          <span class="p-float-label">
            <p-input-number
              v-model.trim="caloriesBurnt"
              input-id="activity-tracking__form--calories"
              :disabled="timerOn"
              :min="0"
              :max="10000"
              :input-props="{ autocomplete: 'off' }"
            />
            <label for="activity-tracking__form--calories">Calories</label>
          </span>
        </div>

        <div class="activity-tracking-card__row">
          <span class="p-float-label">
            <p-input-number
              v-model.trim="distance"
              input-id="activity-tracking__form--distance"
              :disabled="timerOn"
              :min="0"
              :max="1000000"
              :input-props="{ autocomplete: 'off' }"
            />
            <label for="activity-tracking__form--distance">Distance</label>
          </span>
        </div>

        <div class="activity-tracking-card__row">
          <label class="activity-tracking-card__item">Complexity</label>
          <p-rating v-model="complexity" :disabled="timerOn" />
        </div>

        <div class="activity-tracking-card__row">
          <label class="activity-tracking-card__item">Pain level</label>
          <p-rating v-model="painLevel" :disabled="timerOn" />
        </div>
      </section>
    </div>
    <div class="activity-tracking-card__submit-area">
      <p-button :loading="submitButtonLoading" @click.prevent="submitTracking" :disabled="timerOn">
        Record
      </p-button>
    </div>
  </form>
</template>

<script>
import PRating from 'primevue/rating'
import PButton from 'primevue/button'
import PCalendar from 'primevue/calendar'
import PInputNumber from 'primevue/inputnumber'

export default {
  name: 'activity-tracking-card',
  components: { PInputNumber, PRating, PButton, PCalendar },
  data() {
    return {
      currentActivity: undefined,
      currentActivityRepetition: undefined,
      // UI variables
      activityDataLoaded: false,
      moreOptionsDisplayed: false,
      submitButtonLoading: false,
      timerOn: false,
      // form values
      duration: undefined,
      startedAt: undefined,
      count: undefined,
      complexity: undefined,
      painLevel: undefined,
      caloriesBurnt: undefined,
      distance: undefined,
    }
  },
  computed: {
    activitiesMap() {
      return this.$store.getters['activities/activitiesMap']
    },
  },
  methods: {
    toggleMoreOptionDisplayed() {
      this.moreOptionsDisplayed = !this.moreOptionsDisplayed
    },
    startTimer() {
      const repetition = this.createRepetitionObject()
      if (this.currentActivityRepetition) {
        this.$store.dispatch('activities/startActivityRepetition', {
          activityId: this.currentActivity.id,
          repetitionId: this.currentActivityRepetition.id,
          repetition,
        }).then((activityRepetition) => {
          this.currentActivityRepetition = activityRepetition
        }).catch(() => {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to start timer',
            life: 3000,
          })
        })
      } else {
        this.$store.dispatch('activities/createActivityRepetitionStarted', {
          activityId: this.currentActivity.id,
          repetition,
        }).then((activityRepetition) => {
          this.currentActivityRepetition = activityRepetition
        }).catch(() => {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to start timer',
            life: 3000,
          })
        })
      }
    },
    pauseTimer() {
      if (this.currentActivityRepetition) {
        this.$store.dispatch('activities/pauseActivityRepetition', {
          activityId: this.currentActivity.id,
          repetitionId: this.currentActivityRepetition.id,
        }).then((activityRepetition) => {
          this.currentActivityRepetition = activityRepetition
        }).catch(() => {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to pause timer',
            life: 3000,
          })
          this.timerOn = false
        })
      } else {
        this.timerOn = false
      }
    },
    submitTracking() {
      this.submitButtonLoading = true
      const activityId = this.$route.params.activityId

      if (activityId) {
        let timeSpentMs = undefined
        if (this.duration) {
          const hours = this.duration.getHours()
          const minutes = this.duration.getMinutes()
          const seconds = this.duration.getSeconds()
          if (Number.isFinite(hours) && Number.isFinite(minutes) && Number.isFinite(seconds)) {
            timeSpentMs = seconds * 1000 + minutes * 60 * 1000 + hours * 60 * 60 * 1000
          }
        }

        let startedAt = undefined
        if (this.startedAt) {
          startedAt = Date.parse(this.startedAt)
        }
        const repetition = {
          time_spent_ms: timeSpentMs !== 0 ? timeSpentMs : undefined,
          started_at: startedAt,
          ...this.createRepetitionObject(),
        }

        const repetitionId = this.currentActivityRepetition?.id
        this.$store.dispatch('activities/submitActivityRepetition', {
          activityId,
          repetitionId,
          repetition,
        }).then((activityRepetition) => {
          if (activityRepetition.completed) {
            this.currentActivityRepetition = undefined
          }

          this.submitButtonLoading = false
          this.duration = undefined
          this.startedAt = undefined
          this.count = undefined
          this.complexity = undefined
          this.painLevel = undefined
          this.caloriesBurnt = undefined
          this.distance = undefined
          this.$toast.add({
            severity: 'success',
            summary: 'Information',
            detail: 'Successfully added tracking info',
            life: 3000,
          })
        })
          .catch(() => {
            this.submitButtonLoading = false
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to add tracking info',
              life: 3000,
            })
          })
      }
    },
    addToCount(number) {
      let count = this.count || 0
      this.count = count + number
    },
    atMidnightInDays(days) {
      const d = new Date()
      d.setHours(24 * days, 0, 0, 0)
      return d
    },
    createRepetitionObject() {
      return {
        count: this.count,
        complexity: this.complexity,
        pain_level: this.painLevel,
        calories_burnt: this.caloriesBurnt,
        distance: this.distance,
      }
    },
    generateDurationDateFromMillis(millis) {
      let date = this.atMidnightInDays(1)
      if (millis) {
        date = new Date(date.getTime() + millis)
      }
      return date
    },
  },
  watch: {
    currentActivityRepetition(activityRepetition) {
      if (activityRepetition) {
        this.duration = this.generateDurationDateFromMillis(this.currentActivityRepetition.time_spent_ms)
        this.startedAt = new Date(this.currentActivityRepetition.started_at)
        this.count = this.currentActivityRepetition.count
        this.complexity = this.currentActivityRepetition.complexity
        this.painLevel = this.currentActivityRepetition.pain_level
        this.caloriesBurnt = this.currentActivityRepetition.calories_burnt
        this.distance = this.currentActivityRepetition.distance
        this.timerOn = this.currentActivityRepetition.started === true
      } else {
        this.submitButtonLoading = false
        this.duration = undefined
        this.startedAt = undefined
        this.count = undefined
        this.complexity = undefined
        this.painLevel = undefined
        this.caloriesBurnt = undefined
        this.distance = undefined
        this.timerOn = false
      }
    },
  },
  beforeMount() {
    const activityId = this.$route.params.activityId
    if (activityId) {
      const currentActivity = this.activitiesMap?.get(activityId)
      if (currentActivity) {
        this.currentActivity = currentActivity
        const currentRepetitionId = currentActivity.current_repetition_id
        if (currentRepetitionId) {
          this.$store.dispatch('activities/getActivityRepetition', {
            activityId,
            repetitionId: currentRepetitionId,
          }).then((activityRepetition) => {
            this.currentActivityRepetition = activityRepetition
            this.activityDataLoaded = true
          }).catch(() => {
            this.activityDataLoaded = true
          })
        } else {
          this.activityDataLoaded = true
        }
      } else {
        this.activityDataLoaded = true
      }
    } else {
      this.activityDataLoaded = true
    }
  },
}
</script>

<style scoped>
.activity-tracking__form {
  display: flex;
  flex-direction: column;
  background-color: #f8fff8;
  padding: 2.4rem 1.6rem 1.6rem 1.6rem;
  width: fit-content;
  border: 1px solid #ced4da;
  gap: 1.72rem;
}

@media only screen and (min-width: 50rem) {
  .activity-tracking__form {
    padding: 2.4rem 2.4rem 2rem 2.4rem;
  }
}

.activity-tracking__form--section-group {
  gap: 1.72rem;
  display: flex;
  flex-direction: column;
}

@media only screen and (min-width: 50rem) {
  .activity-tracking__form--section-group {
    flex-direction: row;
  }
}

.activity-tracking__form--section {
  display: flex;
  flex-direction: column;
  gap: 1.72rem;
}

.activity-tracking-card__row {
  flex-grow: 10;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-tracking-card__row .p-rating {
  justify-content: space-between;
}

.activity-tracking-card__row .p-float-label {
  flex-grow: 1;
}

.activity-tracking-card__row .p-float-label .p-component {
  width: 100%;
}

.activity-tracking-card__count-additions-area {
  display: flex;
  justify-content: space-between;
}

.activity-tracking-card__count-additions-area span.w-tag:not(.activity-tracking-card__increment-disabled) {
  cursor: pointer;
}

.activity-tracking-card__count-area {
  display: inline-flex;
  flex-direction: column;
}

.activity-tracking-card__show-more-area a {
  color: var(--color-link);
}

.activity-tracking-card__show-more-area a:hover,
.activity-tracking-card__show-more-area a:active {
  color: var(--color-link-hover);
}

.activity-tracking-card__submit-area {
  display: flex;
  justify-content: center;
}

.activity-tracking-card__submit-area button {
  width: 70%;
  justify-content: center;
}

label.activity-tracking-card__item {
  color: #495057;
}

.activity-tracking__row--duration {
  display: flex;
  flex-direction: row;
}
</style>

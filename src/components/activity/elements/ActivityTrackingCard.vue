<template>
  <article class="activity-tracking-card__article">
    <div class="activity-tracking-card__sections-group">
      <section class="activity-tracking-card__section">
        <section class="activity-tracking-card__section-row">
          <label for="dp-input-activity-tracking-card__duration">Duration</label>
          <div class="activity-tracking-card__section-row--item">
            <HyDateTimePicker
              v-model="duration"
              id="activity-tracking-card__duration"
              uid="activity-tracking-card__duration"
              :disabled="timerOn"
              time-only
              enable-seconds
            />

            <HyButton v-if="!timerOn" icon="mdi mdi-play" @click.prevent="startTimer()" />

            <HyButton v-else icon="mdi mdi-pause" theme="orange" @click.prevent="pauseTimer()" />
          </div>
        </section>
        <section class="activity-tracking-card__section-row">
          <label for="dp-input-activity-tracking-card__started_at">Started at</label>
          <div class="activity-tracking-card__section-row--item">
            <HyDateTimePicker
              v-model="startedAt"
              id="activity-tracking-card__started_at"
              uid="activity-tracking-card__started_at"
              :disabled="timerOn"
            />
          </div>
        </section>
        <section class="activity-tracking-card__section-row">
          <label for="activity-tracking-card__count">Count</label>
          <div class="activity-tracking-card__section-row--item">
            <div class="activity-tracking-card__section-row--count-item">
              <input
                v-model.number="count"
                @keydown="allowNumberOnly($event)"
                :disabled="timerOn"
                type="text"
                id="activity-tracking-card__count"
                autocomplete="off"
              />
              <div class="activity-tracking-card__section-row--count-item-buttons">
                <w-tag
                  v-for="num in [1, 2, 5, 10, 20]"
                  @click.prevent="addToCount(num)"
                  :key="num"
                  :class="{ 'activity-tracking-card__increment-disabled': timerOn }"
                  color="black"
                  shadow
                  bg-color="light-green-light5"
                  >+{{ num }}
                </w-tag>
              </div>
            </div>
          </div>
        </section>
      </section>
      <section v-if="moreOptionsDisplayed" class="activity-tracking-card__section">
        <section class="activity-tracking-card__section-row">
          <label for="activity-tracking-card__calories">Calories</label>
          <div class="activity-tracking-card__section-row--item">
            <input
              v-model="caloriesBurnt"
              :disabled="timerOn"
              type="text"
              id="activity-tracking-card__calories"
              autocomplete="off"
            />
          </div>
        </section>
        <section class="activity-tracking-card__section-row">
          <label for="activity-tracking-card__distance">Distance</label>
          <div class="activity-tracking-card__section-row--item">
            <input
              v-model="distance"
              :disabled="timerOn"
              type="text"
              id="activity-tracking-card__distance"
              autocomplete="off"
            />
          </div>
        </section>
        <section class="activity-tracking-card__section-row">
          <label class="activity-tracking-card__item">Complexity</label>
          <div class="activity-tracking-card__section-row--item">
            <p-rating v-model="complexity" :disabled="timerOn" />
          </div>
        </section>
        <section class="activity-tracking-card__section-row">
          <label class="activity-tracking-card__item">Pain level</label>
          <div class="activity-tracking-card__section-row--item">
            <p-rating v-model="painLevel" :disabled="timerOn" />
          </div>
        </section>
      </section>
    </div>
    <section class="activity-tracking-card__show-more-area">
      <a @click.prevent="toggleMoreOptionDisplayed" v-if="moreOptionsDisplayed" href="#">
        Show less properties
      </a>
      <a @click.prevent="toggleMoreOptionDisplayed" v-else href="#">Show more properties</a>
    </section>
    <footer class="activity-tracking-card__footer">
      <HyButton
        theme="green"
        text="Record"
        @click.prevent="!timerOn && submitTracking()"
        :disabled="timerOn"
      />
      <HyButton
        class="activity-tracking-card__footer--delete-button"
        v-if="currentActivityRepetition"
        @click.prevent="deleteRepetition()"
        icon="mdi mdi-trash-can-outline"
        theme="red"
      />
    </footer>
  </article>
</template>

<script>
import PRating from 'primevue/rating'
import HyButton from '@/components/basic/elements/HyButton.vue'
import HyDateTimePicker from '@/components/basic/elements/HyDateTimePicker.vue'

export default {
  name: 'activity-tracking-card',
  props: ['currentActivity'],
  emits: ['onTimerValueChanged', 'onInitialized', 'onActivityRecorded', 'onActivityCancelled'],
  components: { HyDateTimePicker, HyButton, PRating },
  data() {
    return {
      currentActivityRepetition: undefined,
      // UI variables
      activityDataLoaded: false,
      moreOptionsDisplayed: false,
      submitButtonLoading: false,
      timerOn: false,
      timerInterval: undefined,
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
        this.$store
          .dispatch('activities/startActivityRepetition', {
            activityId: this.currentActivity.id,
            repetitionId: this.currentActivityRepetition.id,
            repetition,
          })
          .then((activityRepetition) => {
            this.currentActivityRepetition = activityRepetition
          })
          .catch(() => {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to start timer',
              life: 3000,
            })
          })
      } else {
        this.$store
          .dispatch('activities/createActivityRepetitionStarted', {
            activityId: this.$props.currentActivity.id,
            repetition,
          })
          .then((activityRepetition) => {
            this.currentActivityRepetition = activityRepetition
          })
          .catch(() => {
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
        this.$store
          .dispatch('activities/pauseActivityRepetition', {
            activityId: this.$props.currentActivity.id,
            repetitionId: this.currentActivityRepetition.id,
          })
          .then((activityRepetition) => {
            this.currentActivityRepetition = activityRepetition
          })
          .catch(() => {
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
    deleteRepetition() {
      if (this.currentActivityRepetition) {
        this.$store
          .dispatch('activities/deleteActivityRepetition', {
            activityId: this.$props.currentActivity.id,
            repetitionId: this.currentActivityRepetition.id,
          })
          .then(() => {
            this.currentActivityRepetition = undefined
            this.$props.currentActivity.current_repetition_id = undefined
            this.$toast.add({
              severity: 'success',
              summary: 'Information',
              detail: 'Cancelled activity tracking',
              life: 3000,
            })
            this.$emit('onActivityCancelled')
          })
          .catch(() => {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete activity repetition',
              life: 3000,
            })
            this.timerOn = false
          })
      }
    },
    submitTracking() {
      this.submitButtonLoading = true
      const activityId = this.$route.params.activityId

      if (activityId) {
        let timeSpentMs = undefined
        if (this.duration) {
          const { hours, minutes, seconds } = this.duration
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
        this.$store
          .dispatch('activities/submitActivityRepetition', {
            activityId,
            repetitionId,
            repetition,
          })
          .then((activityRepetition) => {
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
            this.$emit('onActivityRecorded')
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
      if (!this.timerOn) {
        let count = this.count || 0
        this.count = count + number
      }
    },
    recalculateDuration() {
      if (this.currentActivityRepetition) {
        const {
          last_started_at: lastStartedAt,
          time_spent_ms: timeSpentMs,
          started,
        } = this.currentActivityRepetition

        let millis = timeSpentMs ? timeSpentMs : 0
        if (lastStartedAt && started) {
          const now = new Date()
          const lastStartedAtDate = new Date(lastStartedAt).valueOf()
          const delta = now - lastStartedAtDate
          if (delta > 0) {
            millis += delta
          }
        }

        let durationDate = this.atMidnightInDays(1)
        if (millis) {
          durationDate = new Date(durationDate.getTime() + millis)
        }

        const hours = durationDate.getHours()
        const minutes = durationDate.getMinutes()
        const seconds = durationDate.getSeconds()

        this.duration = { hours, minutes, seconds }

        const timeString = `${this.prependZero(hours)}:${this.prependZero(
          minutes,
        )}:${this.prependZero(seconds)}`
        this.$emit('onTimerValueChanged', { time: timeString, paused: !started })
      }
    },
    prependZero(timePart) {
      const timePartString = `${timePart}`
      if (timePartString.length === 1) {
        return `0${timePartString}`
      }
      return timePartString
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
    allowNumberOnly(event) {
      const charCode = event.which ? event.which : event.keyCode
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
        event.preventDefault()
      } else {
        return true
      }
    },
  },
  watch: {
    currentActivityRepetition(activityRepetition) {
      if (activityRepetition) {
        const {
          id,
          started_at: startedAt,
          pain_level: painLevel,
          calories_burnt: caloriesBurnt,
          count,
          complexity,
          distance,
          started,
        } = this.currentActivityRepetition

        this.startedAt = new Date(startedAt)
        this.count = count
        this.complexity = complexity
        this.painLevel = painLevel
        this.caloriesBurnt = caloriesBurnt
        this.distance = distance
        this.recalculateDuration()
        this.timerOn = started === true
        this.$props.currentActivity.current_repetition_id = id
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
        this.$props.currentActivity.current_repetition_id = undefined
        this.$emit('onTimerValueChanged')
      }
      this.$emit('onInitialized')
    },
    timerOn(value) {
      if (value) {
        this.timerInterval = setInterval(this.recalculateDuration, 995)
      } else if (this.timerInterval) {
        clearInterval(this.timerInterval)
      }
    },
  },
  beforeMount() {
    const currentActivity = this.$props.currentActivity
    if (currentActivity) {
      const currentRepetitionId = currentActivity.current_repetition_id
      if (currentRepetitionId) {
        this.$store
          .dispatch('activities/getActivityRepetition', {
            activityId: currentActivity.id,
            repetitionId: currentRepetitionId,
          })
          .then((activityRepetition) => {
            this.currentActivityRepetition = activityRepetition
            this.activityDataLoaded = true
          })
          .catch(() => {
            this.activityDataLoaded = true
            this.$emit('onInitialized')
          })
      } else {
        this.activityDataLoaded = true
        this.$emit('onInitialized')
      }
    } else {
      this.activityDataLoaded = true
      this.$emit('onInitialized')
    }
  },
}
</script>

<style scoped>
.activity-tracking-card__article {
  display: flex;
  flex-direction: column;
  padding: 2rem 2.4rem;
  width: fit-content;
  gap: 1.72rem;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Works on Firefox */
.activity-tracking-card__article {
  scrollbar-width: thin;
  scrollbar-color: rgba(15, 200, 231, 0.3) rgba(255, 255, 255, 0);
}

/* Works on Chrome, Edge, and Safari */
.activity-tracking-card__article::-webkit-scrollbar {
  width: 0.3rem;
  display: block;
}

.activity-tracking-card__article::-webkit-scrollbar-thumb {
  background-color: rgba(15, 200, 231, 0.3);
  border-radius: 0.2rem;
}

.activity-tracking-card__sections-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

@media only screen and (min-width: 50rem) {
  .activity-tracking-card__sections-group {
    flex-direction: row;
    gap: 1.72rem;
  }
}

.activity-tracking-card__section {
  display: flex;
  flex-grow: 10;
  flex-direction: column;
  gap: 0.8rem;
}

#activity-tracking-card__duration {
  width: 11.8rem;
}

@media only screen and (min-width: 50rem) {
  #activity-tracking-card__duration {
    width: 13rem;
  }
}

.activity-tracking-card__section-row {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.activity-tracking-card__section-row a {
  color: var(--color-link);
}

.activity-tracking-card__section-row a:hover,
.activity-tracking-card__section-row a:active {
  color: var(--color-link-hover);
}

.activity-tracking-card__section-row label {
  font-size: 0.8rem;
  color: var(--color-gray-3);
  font-weight: 400;
}

.activity-tracking-card__section-row--item {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  gap: 1rem;
}

.activity-tracking-card__section-row--item .hy-icon-button {
  width: 2.375rem;
  font-size: 1.25rem;
}

.activity-tracking-card__section-row--item .p-rating {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 0.4rem;
}

.activity-tracking-card__section-row--item input {
  height: 2.375rem;
  width: 100%;
  font-size: 1rem;
  outline: none;
  padding: 0.8rem;
  border: 1px solid var(--color-gray-1);
  border-radius: 0.25rem;
  font-family: var(--font-family);
  box-sizing: border-box;
  color: #495057;
}

.activity-tracking-card__section-row--item input[disabled] {
  background-color: #f6f6f6;
}

.activity-tracking-card__section-row--count-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.8rem;
  margin-bottom: 0.64rem;
}

.activity-tracking-card__section-row--count-item-buttons {
  display: flex;
  justify-content: space-between;
}

.activity-tracking-card__show-more-area a {
  color: var(--color-link);
}

.activity-tracking-card__show-more-area a:hover,
.activity-tracking-card__show-more-area a:active {
  color: var(--color-link-hover);
}

.activity-tracking-card__section-row--count-item-buttons
  span.w-tag:not(.activity-tracking-card__increment-disabled) {
  cursor: pointer;
}

.activity-tracking-card__footer {
  display: flex;
  justify-content: center;
  gap: 2rem;
  height: 2.375rem;
  flex-shrink: 0;
}

.activity-tracking-card__footer--delete-button {
  width: 2.375rem;
}
</style>

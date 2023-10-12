<template>
  <VueDatePicker
    v-model="date"
    :teleport="true"
    :time-picker="timeOnly"
    :hide-input-icon="true"
    :enable-seconds="enableSeconds"
    :min-date="minDate()"
    :max-date="maxDate()"
    :disabled="disabled"
    :action-row="{ showNow: !timeOnly }"
    utc
    prevent-min-max-navigation
    input-class-name="date-picker-input"
    :style="{
      '--dp-font-family': 'Inter, Helvetica, monospace',
      '--dp-border-color': 'var(--color-gray-1)',
    }"
  ></VueDatePicker>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  components: { VueDatePicker },
  props: {
    timeOnly: {
      type: Boolean,
      default: false,
    },
    enableSeconds: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['onDateTimeChanged'],
  data() {
    return {
      date: this.$props.timeOnly ? { hours: 0, minutes: 0, seconds: 0 } : undefined,
    }
  },
  methods: {
    minDate() {
      if (this.$props.timeOnly) {
        return undefined
      }
      const date = new Date()
      date.setFullYear(date.getFullYear() - 1)
      return date
    },
    maxDate() {
      if (this.$props.timeOnly) {
        return undefined
      }
      const date = new Date()
      date.setDate(date.getDate() + 1)
      return date
    },
  },
  watch: {
    date(newValue) {
      this.$emit('onDateTimeChanged', newValue)
    },
  },
}
</script>

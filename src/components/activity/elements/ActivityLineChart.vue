<template>
  <div class="activity-line-chart-container">
    <apexchart v-if="durationsData" height="300px" type="line" :options="durationsData.options" :series="durationsData.series" />
    <apexchart v-if="countData" height="300px" type="line" :options="countData.options" :series="countData.series" />
  </div>
</template>

<script>
function adjustAxisNames(array) {
  return array.map((element, index) => {
    return index % 4 === 0 ? element : '';
  });
}

export default {
  props: ['currentActivity', 'version'],
  data() {
    return {
      durationsData: undefined,
      countData: undefined,
      optionsCommon: {
        colors: ['#b243c5'],
        stroke: {
          width: 2,
          curve: 'smooth',
        },
      },
    }
  },
  methods: {
    loadLineChart() {
      this.$store
        .dispatch('activities/getLineChart', {
          activityId: this.$props.currentActivity.id,
        })
        .then((lineChartData) => {
          const { names, durations_in_seconds: durationsInSeconds, counts } = lineChartData
          const adjustedNames = adjustAxisNames(names)
          if (durationsInSeconds) {
            this.durationsData = {
              options: {
                ...this.optionsCommon,
                title: {
                  text: 'Duration in seconds over time',
                  align: 'left',
                },
                chart: {
                  id: 'activity-line-chart__durations',
                  toolbar: {
                    show: false,
                  },
                },
                xaxis: {
                  categories: adjustedNames,
                },
              },
              series: [
                {
                  name: 'Duration in seconds',
                  data: durationsInSeconds,
                },
              ],
            }
          }
          if (counts) {
            this.countData = {
              options: {
                ...this.optionsCommon,
                title: {
                  text: 'Count over time',
                  align: 'left',
                },
                chart: {
                  id: 'activity-line-chart__counts',
                  toolbar: {
                    show: false,
                  },
                },
                xaxis: {
                  categories: adjustedNames,
                },
              },
              series: [
                {
                  name: 'Count',
                  data: counts,
                },
              ],
            }
          }
        })
        .catch(() => {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to get activity line chart',
            life: 3000,
          })
        })
    },
  },
  mounted() {
    this.loadLineChart()
  },
  watch: {
    version() {
      this.loadLineChart()
    },
  },
}
</script>

<style scoped>
.activity-line-chart-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>

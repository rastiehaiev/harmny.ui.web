<template>
  <HyDialog
    :show="isShowTrackingDialog"
    @on-dialog-close-event="onDialogCloseEvent()"
    :header-text="currentActivity.name"
  >
    <template #default>
      <ActivityTrackingCard
        @on-initialized="onActivityTrackingInitialized()"
        @on-timer-value-changed="(payload) => onTimerValue(payload)"
        @on-activity-recorded="onActivityRecorded()"
        @on-activity-cancelled="onActivityCancelled()"
        :current-activity="currentActivity"
      />
    </template>
  </HyDialog>
  <HyTabs>
    <HyTabsItem @click.prevent="this.setIsSummary(true)" :selected="isSummary">
      Summary
    </HyTabsItem>
    <HyTabsItem @click.prevent="this.setIsSummary(false)" :selected="!isSummary">
      Details
    </HyTabsItem>
  </HyTabs>
  <header class="activity-section__content--options-container">
    <a v-if="activityTrackingInitialized" class="link__default" href="#" @click.prevent="toggleIsShowTrackingDialog()">
      <HyMenuButton v-if="timerPaused" icon="mdi mdi-pause-circle-outline" theme="orange">
        Paused: {{ timerValue }}
      </HyMenuButton>
      <HyMenuButton v-else-if="timerValue" icon="mdi mdi-play-circle-outline" theme="green">
        In progress: {{ timerValue }}
      </HyMenuButton>
      <HyMenuButton v-else-if="!timerValue" icon="mdi mdi-play-circle" theme="green">
        Launch
      </HyMenuButton>
      <span v-else><w-icon>mdi mdi-eye-off-outline</w-icon> Hide tracking panel</span>
    </a>
  </header>
  <HyContainerWithFixedRightSidebar v-show="isSummary" class="activity-section__dashboard">
    <template #left>
      <section class="activity-section__dashboard--main">
        <ActivityStatisticsContainer :current-activity="currentActivity" :version="dashboardVersion" />
        <ActivityLineChart :current-activity="currentActivity" :version="dashboardVersion" />
      </section>
    </template>
    <template #right>
      <section class="activity-section__dashboard--sidebar">
        <ActivityRepetitionsHistory
          @on-activity-repetition-deleted="onActivityRepetitionDeleted()"
          :current-activity="currentActivity"
          :version="dashboardVersion" />
      </section>
    </template>
  </HyContainerWithFixedRightSidebar>
  <div v-show="!isSummary"></div>
</template>

<script>
import ActivityTrackingCard from '@/components/activity/elements/ActivityTrackingCard.vue'
import ActivityStatisticsContainer from '@/components/activity/elements/ActivityStatisticsContainer.vue'
import ActivityRepetitionsHistory from '@/components/activity/elements/ActivityRepetitionsHistory.vue'
import ActivityLineChart from '@/components/activity/elements/ActivityLineChart.vue'

import HyTabs from '@/components/basic/elements/tabs/HyTabs.vue'
import HyTabsItem from '@/components/basic/elements/tabs/HyTabsItem.vue'
import HyMenuButton from '@/components/basic/elements/HyMenuButton.vue'
import HyDialog from '@/components/basic/elements/HyDialog.vue'
import HyContainerWithFixedRightSidebar from '@/components/basic/containers/HyContainerWithFixedRightSidebar.vue'

export default {
  props: ['currentActivity'],
  components: {
    ActivityTrackingCard,
    ActivityStatisticsContainer,
    ActivityRepetitionsHistory,
    ActivityLineChart,
    HyTabs,
    HyTabsItem,
    HyMenuButton,
    HyDialog,
    HyContainerWithFixedRightSidebar,
  },
  data() {
    return {
      isSummary: true,
      isShowTrackingDialog: false,
      timerValue: undefined,
      timerPaused: false,
      activityTrackingInitialized: false,
      dashboardVersion: this.getCurrentTime(),
    }
  },
  methods: {
    setIsSummary(isSummary) {
      this.isSummary = isSummary
    },
    onActivityRecorded() {
      this.dashboardVersion = this.getCurrentTime()
      this.onDialogCloseEvent()
    },
    onActivityRepetitionDeleted() {
      this.dashboardVersion = this.getCurrentTime()
    },
    onActivityCancelled() {
      this.onDialogCloseEvent()
    },
    onDialogCloseEvent() {
      this.isShowTrackingDialog = false
    },
    toggleIsShowTrackingDialog() {
      this.isShowTrackingDialog = !this.isShowTrackingDialog
    },
    onTimerValue(payload) {
      if (payload) {
        const { time, paused } = payload
        this.timerValue = time
        this.timerPaused = paused
      } else {
        this.timerValue = undefined
        this.timerPaused = undefined
      }
    },
    onActivityTrackingInitialized() {
      this.activityTrackingInitialized = true
    },
    getCurrentTime() {
      return new Date()
    },
  },
}
</script>

<style scoped>
.activity-section__content--options-container {
  display: flex;
  height: var(--header-default-height);
  flex-grow: 0;
  flex-shrink: 0;
  border-bottom: 1px solid var(--color-gray-0);
  justify-content: right;
  align-items: center;
  padding: 0 2rem;
}

.activity-section__dashboard {
  height: calc(100% - var(--header-default-height) - var(--header-default-height));
}

@media only screen and (min-width: 50rem) {
  .activity-section__dashboard {
    height: calc(100vh - var(--header-default-height) - var(--header-default-height) - var(--breadcrumbs-height));
    padding-bottom: 0;
  }
}

.activity-section__dashboard--main {
  display: flex;
  flex-direction: column;
  flex-grow: 10;
  padding: 2rem 3.2rem;
  gap: 2rem;
}

.activity-section__dashboard--sidebar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: 2rem 3.2rem;
}

@media only screen and (min-width: 50rem) {
  .activity-section__dashboard--sidebar {
    padding: 2rem;
  }
}
</style>

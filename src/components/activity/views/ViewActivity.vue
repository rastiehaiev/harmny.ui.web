<template>
  <HyTabs>
    <HyTabsItem @click.prevent="this.setIsSummary(true)" :selected="isSummary">
      Summary
    </HyTabsItem>
    <HyTabsItem @click.prevent="this.setIsSummary(false)" :selected="!isSummary">
      Details
    </HyTabsItem>
  </HyTabs>
  <ActivitySectionContent>
    <template #header v-if="activityTrackingInitialized">
      <header class="activity-section__content--options-container">
        <a class="link__default" href="#" @click.prevent="toggleIsShowTrackingDialog()">
          <HyMenuButton v-if="timerPaused" icon="mdi mdi-pause-circle-outline" theme="orange">
            Paused: {{ timerValue }}
          </HyMenuButton>
          <HyMenuButton v-else-if="timerValue" icon="mdi mdi-play-circle-outline" theme="green">
            In progress: {{ timerValue }}
          </HyMenuButton>
          <HyMenuButton v-else-if="!timerValue" icon="mdi mdi-play-circle" theme="green">
            Run
          </HyMenuButton>
          <span v-else><w-icon>mdi mdi-eye-off-outline</w-icon> Hide tracking panel</span>
        </a>
      </header>
    </template>
    <template #default>
      <div v-show="isSummary">
        <section class="activity-tracking-section">
          <HyDialog
            :show="isShowTrackingDialog"
            @on-dialog-close-event="onDialogCloseEvent()"
            :header-text="currentActivity.name"
          >
            <template #default>
              <ActivityTrackingCard
                @on-initialized="onActivityTrackingInitialized()"
                @on-timer-value-changed="(payload) => onTimerValue(payload)"
                @on-activity-recorded="onDialogCloseEvent()"
                @on-activity-cancelled="onDialogCloseEvent()"
                :current-activity="currentActivity"
              />
            </template>
          </HyDialog>
        </section>
      </div>
      <div v-show="!isSummary">Activity details will go here...</div>
    </template>
  </ActivitySectionContent>
</template>

<script>
import ActivitySectionContent from '@/components/activity/elements/ActivitySectionContent.vue'
import ActivityTrackingCard from '@/components/activity/elements/ActivityTrackingCard.vue'

import HyTabs from '@/components/basic/elements/tabs/HyTabs.vue'
import HyTabsItem from '@/components/basic/elements/tabs/HyTabsItem.vue'
import HyMenuButton from '@/components/basic/elements/HyMenuButton.vue'
import HyDialog from '@/components/basic/elements/HyDialog.vue'

export default {
  props: ['currentActivity'],
  components: {
    ActivityTrackingCard,
    ActivitySectionContent,
    HyTabs,
    HyTabsItem,
    HyMenuButton,
    HyDialog,
  },
  data() {
    return {
      isSummary: true,
      isShowTrackingDialog: false,
      timerValue: undefined,
      timerPaused: false,
      activityTrackingInitialized: false,
    }
  },
  methods: {
    setIsSummary(isSummary) {
      this.isSummary = isSummary
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
  },
}
</script>

<style scoped>
.activity-tracking-section {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}

@media only screen and (min-width: 60rem) {
  .activity-tracking-section {
    align-items: start;
  }
}

.activity-section__content--options-container {
  display: flex;
  height: 2.8rem;
  flex-grow: 0;
  flex-shrink: 0;
  border-bottom: 1px solid var(--color-gray-0);
  justify-content: right;
  align-items: center;
  padding: 0 2rem;
}
</style>

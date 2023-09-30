<template>
  <section class="activity-section">
    <header v-if="!!this.tabs" class="activity-tabs-header">
      <ul>
        <li
          v-for="tab in tabs"
          :key="tab"
          :class="[{ 'activity-tabs__selected': currentTab === tab }]"
          @click="this.currentTab = tab"
        >
          {{ tab.name }}
        </li>
      </ul>
    </header>
    <section class="activity-section__content">
      <div class="activity-section__content-container">
        <keep-alive>
          <component
            v-if="this.currentTab"
            :is="this.currentTab.componentName"
            :key="this.currentTab.componentName + '_' + getCurrentActivityId()"></component>
        </keep-alive>
      </div>
    </section>
  </section>
</template>

<script>
const tabsPerType = {
  activities: [
    {
      name: 'Dashboard',
      componentName: 'activities-dashboard',
    },
  ],
  activity: [
    {
      name: 'Summary',
      componentName: 'activity-summary',
    },
    {
      name: 'Details',
      componentName: 'activity-details',
    },
  ],
  'activity-group': [
    {
      name: 'Summary',
      componentName: 'activity-group-summary',
    },
  ],
}

export default {
  data() {
    return {
      tabs: undefined,
      currentTab: undefined,
      currentActivity: undefined,
    }
  },
  methods: {
    getCurrentActivityId() {
      return this.currentActivity ? this.currentActivity.id : undefined
    },
    updateCurrentActivity() {
      if (this.activitiesMap !== undefined) {
        const activityId = this.$route.params.activityId
        if (activityId) {
          this.currentActivity = this.activitiesMap?.get(activityId)
        } else {
          this.currentActivity = undefined
        }
        this.updateTabs()
      }
    },
    updateTabs() {
      let tabType = 'activities'
      if (this.currentActivity) {
        if (this.currentActivity.group) {
          tabType = 'activity-group'
        } else {
          tabType = 'activity'
        }
      }
      const tabs = tabsPerType[tabType]
      if (tabs) {
        this.currentTab = tabs.at(0)
        this.tabs = tabs
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
  mounted() {
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

.activity-tabs-header {
  width: 100%;
  height: 2.8rem;
  border-bottom: 1px solid var(--color-gray-0);
  flex-shrink: 0;
}

.activity-tabs-header ul {
  margin-left: 0.8rem;
  list-style: none;
  display: flex;
  height: 100%;
  gap: 0.8rem;
}

.activity-tabs-header ul li {
  cursor: pointer;
  color: var(--color-gray-2);
  display: flex;
  height: 100%;
  align-items: center;
  padding: 0 0.8rem;
  box-sizing: content-box;
}

.activity-tabs-header ul li.activity-tabs__selected,
.activity-tabs-header ul li:hover {
  color: var(--color-magenta-1);
  border-bottom: 2px solid var(--color-magenta-1);
}

.activity-section__content {
  padding: 2rem;
  display: flex;
  overflow-y: auto;
}

@media only screen and (min-width: 50rem) {
  .activity-section__content {
    padding: 2rem;
  }
}

/* Works on Firefox */
.activity-section__content {
  scrollbar-width: thin;
  scrollbar-color: rgba(15, 200, 231, 0.3) rgba(255, 255, 255, 0);
}

/* Works on Chrome, Edge, and Safari */
.activity-section__content::-webkit-scrollbar {
  width: 0.3rem;
  display: block;
}

.activity-section__content::-webkit-scrollbar-thumb {
  background-color: rgba(15, 200, 231, 0.3);
  border-radius: 0.2rem;
}

.activity-section__content-container {
  height: max-content;
  display: flex;
  width: 100%;
}
</style>

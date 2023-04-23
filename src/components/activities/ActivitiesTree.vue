<template>
    <aside class="activities-tree__collapsed-view"
           @click="expandHorizontally"
           :style="{ 'display': activitiesTreeCollapseViewDisplay }">
        <div class="activities-tree__collapsed-view--wrapper">
            <h3 class="activities-tree__header">Activities Tree</h3>
            <icon-activities-action-items-collapse/>
        </div>
    </aside>
    <section class="activities-tree-section" :style="{ 'display': activitiesTreeSectionDisplay }">
        <header class="activities-tree__action-items">
            <h3 class="activities-tree__header">Activities Tree</h3>
            <div class="activities-tree__action-items--container">
                <icon-activities-action-items-new-folder @click="createActivityCandidate(true)"/>
                <icon-activities-action-items-collapse-vertical
                        v-if="this.currentExpandLevel > 0"
                        @click="collapseOneLevelVertical"
                />
                <icon-activities-action-items-expand-vertical
                        v-if="this.currentExpandLevel === 0"
                        @click="expandAllVertical"
                />
                <icon-activities-action-items-collapse @click="collapseHorizontally" class="activities-tree__action-items--available-collapsed"/>
            </div>
        </header>
        <div class="activities-tree">
            <ul class="activities-tree__items">
                <activity-item
                        v-for="activity in activities"
                        :key="activity.id"
                        :activity="activity"
                        :level="0"
                        @onActivityCreateAttempt="(group, parent) => createActivityCandidate(group, parent)"
                        @emitActivityCreation="(group, parent) => createActivityCandidate(group, parent)"
                />
            </ul>
        </div>
    </section>
</template>

<script>

import activitiesService from "@/services/activities-service.js";
import ActivityItem from "@/components/activities/ActivityItem.vue";

function expandVertical(activity) {
    if (activity.group && activity.child_activities && activity.child_activities.length && activity.child_activities.length > 0) {
        activity.opened = true;
        for (const childActivity of activity.child_activities) {
            expandVertical(childActivity);
        }
    }
}

function collapseVertical(activities, level) {
    // maybe creating map of [level, array of activities] would be more efficient?
    if (activities && activities.length && activities.length > 0) {
        if (level === 0) {
            activities.forEach(activity => {
                if (activity.group && activity.child_activities && activity.child_activities.length && activity.child_activities.length > 0) {
                    activity.opened = false;
                }
            });
        } else {
            activities.forEach(activity => {
                if (activity.group && activity.opened && activity.child_activities && activity.child_activities.length && activity.child_activities.length > 0) {
                    collapseVertical(activity.child_activities, level - 1);
                }
            });
        }
    }
}

function isMobileView() {
    let isMobileView = false;
    const sideBarElem = document.getElementById('app-sidebar');
    if (sideBarElem) {
        isMobileView = getComputedStyle(sideBarElem).borderTopStyle !== 'none';
    }
    return isMobileView;
}

const activitiesTreeConfig = {
    // mobile view
    true: {
        expanded: {
            activitiesTreeCollapseViewDisplay: 'none',
            activitiesTreeSectionDisplay: 'flex',
        },
        collapsed: {
            activitiesTreeCollapseViewDisplay: 'block',
            activitiesTreeSectionDisplay: 'none',
        },
        default: {
            activitiesTreeCollapseViewDisplay: 'block',
            activitiesTreeSectionDisplay: 'none',
        },
    },
    // desktop view
    false: {
        expanded: {
            activitiesTreeCollapseViewDisplay: 'none',
            activitiesTreeSectionDisplay: 'flex',
        },
        collapsed: {
            activitiesTreeCollapseViewDisplay: 'block',
            activitiesTreeSectionDisplay: 'none',
        },
        default: {
            activitiesTreeCollapseViewDisplay: 'none',
            activitiesTreeSectionDisplay: 'flex',
        },
    },
};

export default {
    name: 'activities-tree',
    components: {ActivityItem},
    data() {
        return {
            isMobileView: isMobileView(),
            activitiesTreeCollapseViewDisplay: undefined,
            activitiesTreeSectionDisplay: undefined,
        }
    },
    methods: {
        isActivityCandidate(activityId) {
            return activitiesService.isActivityCandidate(activityId);
        },
        cancelActivityCreation() {
            this.$store.commit('activities/removeActivity', activitiesService.activityCandidateId);
        },
        createActivityCandidate(group = true, parentActivityId = undefined) {
            console.log(`On activity candidate create: group(${group}), parent(${parentActivityId}).`);
            let parentActivity = undefined;
            if (parentActivityId) {
                parentActivity = this.activitiesMap.get(parentActivityId);
                if (!parentActivity) {
                    console.log(`No parent activity found by id='${parentActivityId}'.`);
                    return;
                }
                if (!parentActivity.group) {
                    console.log(`Parent activity '${parentActivityId}' is not a group.`);
                    return;
                }
            }
            const existingActivity = this.activitiesMap.get(activitiesService.activityCandidateId);
            const inTheSameGroup = existingActivity && existingActivity.parent_activity_id === parentActivityId;
            const inAnotherGroup = existingActivity && existingActivity.parent_activity_id !== parentActivityId;
            if (inTheSameGroup || inAnotherGroup) {
                this.$store.commit('activities/removeActivity', existingActivity.id);
            }
            if (!existingActivity || inAnotherGroup) {
                const newPotentialActivity = {
                    id: activitiesService.activityCandidateId,
                    parent_activity_id: parentActivityId,
                    name: "",
                    group,
                };
                if (parentActivity) {
                    parentActivity.opened = true;
                }
                this.$store.commit('activities/addActivity', newPotentialActivity);
            }
        },
        expandAllVertical() {
            if (this.activities && this.activities.length && this.activities.length > 0) {
                for (const activity of this.activities) {
                    expandVertical(activity);
                }
                this.$store.commit('activities/refreshCurrentExpandLevel');
            }
        },
        collapseOneLevelVertical() {
            collapseVertical(this.activities, this.currentExpandLevel - 1);
            this.$store.commit('activities/refreshCurrentExpandLevel');
        },
        expandHorizontally() {
            const displayConfig = activitiesTreeConfig[this.isMobileView].expanded;
            this.activitiesTreeCollapseViewDisplay = displayConfig.activitiesTreeCollapseViewDisplay;
            this.activitiesTreeSectionDisplay = displayConfig.activitiesTreeSectionDisplay;
        },
        collapseHorizontally() {
            const displayConfig = activitiesTreeConfig[this.isMobileView].collapsed;
            this.activitiesTreeCollapseViewDisplay = displayConfig.activitiesTreeCollapseViewDisplay;
            this.activitiesTreeSectionDisplay = displayConfig.activitiesTreeSectionDisplay;
        },
        setDisplayProperties() {
            const displayConfig = activitiesTreeConfig[this.isMobileView].default;
            this.activitiesTreeSectionDisplay = displayConfig.activitiesTreeSectionDisplay;
            this.activitiesTreeCollapseViewDisplay = displayConfig.activitiesTreeCollapseViewDisplay;
        },
        onResize() {
            let isMobile = isMobileView();
            if (this.isMobileView !== isMobile) {
                this.isMobileView = isMobile;
            }
            console.log('Is mobile: ', isMobile);
        },
    },
    computed: {
        activities() {
            return this.$store.getters['activities/activities'];
        },
        activitiesMap() {
            return this.$store.getters['activities/activitiesMap'];
        },
        currentExpandLevel() {
            return this.$store.getters['activities/currentExpandLevel'];
        },
    },
    watch: {
        isMobileView() {
            this.setDisplayProperties();
        },
    },
    beforeMount() {
        this.$store.commit('activities/refreshCurrentExpandLevel');
        this.setDisplayProperties();
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize);
        })
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.onResize);
    },
}
</script>

<style>
.activities-tree__collapsed-view {
    width: 2.8rem;
    height: 100%;
    background-color: rgba(186, 224, 223, 0.09);
    border-right: 1px solid #EAEAEA;
    cursor: pointer;
}

.activities-tree__collapsed-view--wrapper {
    display: flex;
    box-sizing: border-box;
    width: 20rem;
    height: 2.8rem;
    align-items: center;
    justify-content: right;
    gap: 1rem;
    padding: 0 1rem;
    transform: rotateZ(-90deg) translateY(-20rem);
    transform-origin: top right;
}

.activities-tree__header {
    font-size: 1rem;
    font-weight: 350;
    color: #ACABAB;
}

.activities-tree__collapsed-view svg {
    width: 1.4rem;
    height: 1.4rem;
    fill: #909090;
    transform: rotateZ(-90deg);
    transform-origin: center center;
}

.activities-tree-section {
    position: absolute;
    width: 80%;
    display: none;
    flex-direction: column;
    border-right: 1px solid #EAEAEA;
    background-color: rgba(186, 224, 223, 0.09);
    /* 100% - activities tree header height */
    height: calc(100% - 1.6rem);
}

.activities-tree__action-items {
    height: 1.6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.4rem 0.4rem 0.4rem 1.2rem;
    min-width: 9.6rem;
}

@media only screen and (min-width: 50rem) {
    .activities-tree__collapsed-view {
        display: none;
    }

    .activities-tree-section {
        position: static;
        display: flex;
        /* 100% - activities tree header height */
        height: calc(100% - 1.6rem);
        width: 20rem;
    }
}

.activities-tree__action-items--container {
    display: flex;
    flex-direction: row;
}

.activities-tree__action-items--container svg {
    margin-left: 0.4rem;
    width: 1.4rem;
    height: 1.4rem;
    fill: #909090;
    cursor: pointer;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.activities-tree {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow-y: auto;
    /* 100% - breadcrumbs height - activities tree header height - footer height */
    height: calc(100% - 3.6rem - 1.6rem - 4rem);
    box-sizing: border-box;
}

/* Works on Firefox */
.activities-tree {
    scrollbar-width: thin;
    scrollbar-color: #0FC8E71F rgba(255, 255, 255, 0);
}

/* Works on Chrome, Edge, and Safari */
.activities-tree::-webkit-scrollbar {
    width: 0.1rem;
    display: block;
}

.activities-tree::-webkit-scrollbar-thumb {
    background-color: #0FC8E71F;
    border-radius: 0.2rem;
}

@media only screen and (min-width: 50rem) {
    .activities-tree {
        padding-bottom: 1rem;
        /* 100% - breadcrumbs height - activities tree header height */
        height: calc(100% - 3.6rem - 1.6rem);
    }
}

</style>
<template>
    <aside class="activities-tree__collapsed-view"
           @click="expandHorizontally"
           :style="{ 'display': activitiesTreeCollapseViewDisplay }">
        <div class="activities-tree__collapsed-view--wrapper">
            <h3 class="activities-tree__header">Activities Tree</h3>
            <w-icon>
                mdi mdi-page-first
            </w-icon>
        </div>
    </aside>
    <section class="activities-tree-section" :style="{ 'display': activitiesTreeSectionDisplay }">
        <header class="activities-tree__action-items">
            <h3 class="activities-tree__header">Activities Tree</h3>
            <div class="activities-tree__action-items--container">
                <w-icon @click="createGroupActivityCandidateInRoot()">
                    mdi mdi-folder-plus-outline
                </w-icon>
                <w-icon v-if="this.currentExpandLevel > 0" @click="collapseOneLevelVertical">
                    mdi mdi-format-vertical-align-center
                </w-icon>
                <w-icon v-if="this.currentExpandLevel === 0" @click="expandAllVertical">
                    mdi mdi-unfold-more-horizontal
                </w-icon>
                <w-icon @click="collapseHorizontally" class="activities-tree__action-items--available-collapsed">
                    mdi mdi-page-first
                </w-icon>
            </div>
        </header>
        <div class="activities-tree">
            <ul class="activities-tree__items">
                <activities-tree-item
                        v-for="activity in activities"
                        :key="activity.id"
                        :activity="activity"
                        :level="0"
                />
            </ul>
        </div>
    </section>
</template>

<script>

import activitiesService from "@/services/activities-service.js";
import ActivitiesTreeItem from "@/components/activities/ActivitiesTreeItem.vue";

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
    components: {ActivitiesTreeItem},
    data() {
        return {
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
        createGroupActivityCandidateInRoot() {
            this.$store.dispatch('activities/createActivityCandidate', {group: true});
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
        isMobileView() {
            return this.$store.getters.isMobileView;
        },
    },
    watch: {
        '$store.state.mobile': function () {
            this.setDisplayProperties();
        }
    },
    beforeMount() {
        this.$store.commit('activities/refreshCurrentExpandLevel');
        this.setDisplayProperties();
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

@media only screen and (min-width: 50rem) {
    .activities-tree__collapsed-view {
        display: none;
    }
}

.activities-tree__collapsed-view--wrapper {
    display: flex;
    width: 20rem;
    height: 2.8rem;
    align-items: center;
    justify-content: right;
    gap: 1rem;
    padding: 0 1rem;
    transform: rotateZ(-90deg) translateY(-20rem);
    transform-origin: top right;
}

.activities-tree__collapsed-view i {
    font-size: 1.4rem;
    color: #909090;
    transform: rotateZ(-90deg);
    transform-origin: center center;
}

.activities-tree__header {
    font-size: 1rem;
    font-weight: 350;
    color: #ACABAB;
}

.activities-tree-section {
    position: absolute;
    width: 60%;
    display: none;
    flex-direction: column;
    border-right: 1px solid #EAEAEA;
    background-color: rgba(186, 224, 223, 0.09);
    height: calc(100% - 3.6rem - 4rem);
    padding-bottom: 2.2rem;
}

@media only screen and (min-width: 50rem) {
    .activities-tree-section {
        position: static;
        display: flex;
        height: 100%;
        width: 20rem;
    }
}

.activities-tree__action-items {
    height: 2.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.4rem 0 1.2rem;
    min-width: 9.6rem;
}

.activities-tree__action-items--container {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
}

.activities-tree__action-items--container i {
    font-size: 1.3rem;
    color: #909090;
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
    height: 100%;
}

@media only screen and (min-width: 50rem) {
    .activities-tree {
        height: calc(100% - 2.4rem);
    }
}

/* Works on Firefox */
.activities-tree {
    scrollbar-width: thin;
    scrollbar-color: rgba(15, 200, 231, 0.3) rgba(255, 255, 255, 0);
}

/* Works on Chrome, Edge, and Safari */
.activities-tree::-webkit-scrollbar {
    width: 0.1rem;
    display: block;
}

.activities-tree::-webkit-scrollbar-thumb {
    background-color: rgba(15, 200, 231, 0.3);
    border-radius: 0.2rem;
}

</style>
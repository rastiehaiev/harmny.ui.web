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
                <w-tooltip>
                    <template #activator="{ on }">
                        <w-icon @click="refreshActivities" v-on="on">
                            mdi mdi-refresh
                        </w-icon>
                    </template>
                    Refresh
                </w-tooltip>
                <w-tooltip>
                    <template #activator="{ on }">
                        <w-icon @click="startCreatingGroupActivityInRoot"
                                v-on="on"
                                :class="{'activities-tree__action-items--animated-create-folder-icon': !activitiesLoadingInProgress && (!this.activities || this.activities.length === 0)}">
                            mdi mdi-folder-plus-outline
                        </w-icon>
                    </template>
                    Create activity group
                </w-tooltip>
                <w-tooltip v-if="this.currentExpandLevel > 0">
                    <template #activator="{ on }">
                        <w-icon @click="collapseOneLevelVertical" v-on="on">
                            mdi mdi-format-vertical-align-center
                        </w-icon>
                    </template>
                    Collapse vertically
                </w-tooltip>
                <w-tooltip v-if="this.currentExpandLevel === 0 && this.activities && this.activities.length > 0">
                    <template #activator="{ on }">
                        <w-icon @click="expandAllVertical" v-on="on">
                            mdi mdi-unfold-more-horizontal
                        </w-icon>
                    </template>
                    Expand vertically
                </w-tooltip>
                <w-tooltip>
                    <template #activator="{ on }">
                        <w-icon @click="collapseHorizontally" v-on="on" class="activities-tree__action-items--available-collapsed">
                            mdi mdi-page-first
                        </w-icon>
                    </template>
                    Collapse horizontally
                </w-tooltip>
            </div>
        </header>
        <div class="activities-tree">
            <ul v-if="activities && activities.length > 0" class="activities-tree__items">
                <activities-tree-item
                        v-for="activity in activities"
                        :key="activity.id"
                        :activity="activity"
                        :level="0"
                />
            </ul>
            <div v-else-if="activitiesLoadingInProgress"></div>
            <div v-else class="activities-tree__no-activities-container">
                No activities created yet.
            </div>
        </div>
    </section>
    <w-dialog @before-close="cancelActivityDeletion" v-model="showDeleteActivityDialog" width="25rem">
        <div class="activities-tree-section__delete-activity-dialog-container">
            <header class="activities-tree-section__delete-activity-dialog-container--header">
                <h3>Delete activity?</h3>
                <w-icon @click="cancelActivityDeletion">mdi mdi-close</w-icon>
            </header>
            <section class="activities-tree-section__delete-activity-dialog-container--body">
                <template v-if="activityToBeDeleted && activityToBeDeleted.group">
                    Are you sure you want to delete activity group? It will delete all child activities and activity
                    groups with all the data available, permanently.
                </template>
                <template v-if="activityToBeDeleted && !activityToBeDeleted.group">
                    Are you sure you want to delete activity?<br/>It will delete all the data available, permanently.
                </template>
            </section>
            <section class="activities-tree-section__delete-activity-dialog-container--action-items">
                <hy-button @click="cancelActivityDeletion">Cancel</hy-button>
                <hy-button button-style="red" @click="confirmActivityDeletion">Delete</hy-button>
            </section>
        </div>
    </w-dialog>
</template>

<script>

import activitiesService from "@/services/activities-service.js";
import ActivitiesTreeItem from "@/components/activities/ActivitiesTreeItem.vue";
import HyButton from "@/components/basic/elements/HyButton.vue";

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
    components: {HyButton, ActivitiesTreeItem},
    data() {
        return {
            showDeleteActivityDialog: false,
            activitiesTreeCollapseViewDisplay: undefined,
            activitiesTreeSectionDisplay: undefined,
        }
    },
    methods: {
        startCreatingGroupActivityInRoot() {
            this.$store.dispatch('activities/startActivityCreation', {group: true});
        },
        refreshActivities() {
            activitiesService.listAll()
                .then(activities => {
                    this.$store.dispatch('activities/applyFreshActivities', {activities});
                    const activityId = this.$route.params.activityId;
                    if (activityId) {
                        this.$store.commit('activities/openAllInActivityHierarchy', activityId);
                    }
                    this.$store.commit('activities/finishActivitiesLoading');
                })
                .catch(() => {
                    this.$store.commit('activities/finishActivitiesLoading');
                });
        },
        confirmActivityDeletion() {
            const activity = this.activityToBeDeleted;
            this.$store.commit('notifications/setActivityToBeDeleted', undefined);
            if (activity) {
                this.$store.dispatch('activities/deleteActivity', activity.id);
                if (activity.parent_activity_id) {
                    this.$router.push({name: 'activity', params: {activityId: activity.parent_activity_id}});
                } else {
                    this.$router.push({name: 'activities'});
                }
            }
        },
        cancelActivityDeletion() {
            this.$store.commit('notifications/setActivityToBeDeleted', undefined);
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
        activityInEditMode() {
            return this.$store.getters['activities/activityInEditMode'];
        },
        currentExpandLevel() {
            return this.$store.getters['activities/currentExpandLevel'];
        },
        isMobileView() {
            return this.$store.getters.isMobileView;
        },
        activityToBeDeleted() {
            return this.$store.getters['notifications/activityToBeDeleted'];
        },
        activitiesLoadingInProgress() {
            return this.$store.getters['activities/activitiesLoadingInProgress'];
        },
    },
    watch: {
        '$store.state.mobile': function () {
            this.setDisplayProperties();
        },
        activityToBeDeleted(activity) {
            this.showDeleteActivityDialog = !!activity;
        },
    },
    beforeMount() {
        this.$store.commit('activities/refreshCurrentExpandLevel');
        this.setDisplayProperties();
    },
    mounted() {
        this.refreshActivities();
    },
    beforeUnmount() {
        this.$store.commit('activities/removeActivityInEditMode');
    },
}
</script>

<style>
.activities-tree__collapsed-view {
    width: 2.8rem;
    height: 100%;
    background-color: rgba(186, 224, 223, 0.09);
    border-right: 1px solid var(--color-gray-0);
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
    color: var(--color-gray-2);
    transform: rotateZ(-90deg);
    transform-origin: center center;
}

.activities-tree__header {
    font-size: 1rem;
    color: var(--color-gray-1);
    font-family: inherit;
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
    color: var(--color-gray-2);
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

.activities-tree__no-activities-container {
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-gray-4);
}

.activities-tree-section__delete-activity-dialog-container {
    display: flex;
    flex-direction: column;
    padding: 1rem 1rem 0.8rem 1rem;
    gap: 1.2rem;
}

.activities-tree-section__delete-activity-dialog-container--header {
    display: flex;
    align-items: center;
}

.activities-tree-section__delete-activity-dialog-container--header h3 {
    display: inline-flex;
    font-weight: 400;
    flex-grow: 10;
    font-size: 1.25rem;
}

.activities-tree-section__delete-activity-dialog-container--header i {
    cursor: pointer;
    color: var(--color-gray-2);
    font-size: 1.6rem;
}

.activities-tree-section__delete-activity-dialog-container--header i:hover {
    color: var(--color-gray-4);
}

.activities-tree-section__delete-activity-dialog-container--body {
    font-size: 1rem;
    line-height: 1.4rem;
}

.activities-tree-section__delete-activity-dialog-container--action-items {
    display: flex;
    gap: 0.8rem;
    justify-content: end;
}

.activities-tree__action-items--animated-create-folder-icon {
    animation-name: animate-create-folder-icon;
    animation-duration: 3s;
    animation-iteration-count: 20;
}

@keyframes animate-create-folder-icon {
    0%  {color: red;}
    25%   {color: green;}
    75%   {color: blue;}
    100%   {color: red;}
}

</style>
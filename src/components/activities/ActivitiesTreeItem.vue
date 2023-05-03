<template>
    <hy-list-item :key="activity.id" :route-to="routeTo(activity.id)" :level="level" padding-left="1.2rem">
        <template #left-icon>
            <w-icon class="activity_item__icon-activity" v-if="!activity.group">mdi mdi-rocket-launch</w-icon>
            <w-icon class="activity_item__icon-activity-group" v-else-if="!activity.child_activities || activity.child_activities.length === 0">
                mdi mdi-folder-outline
            </w-icon>
            <w-icon class="activity_item__icon-activity-group" @click.prevent="expandGroup(activity.id)" v-else-if="!activity.opened">
                mdi mdi-folder
            </w-icon>
            <w-icon class="activity_item__icon-activity-group" @click.prevent="collapseGroup(activity.id)" v-else>mdi
                mdi-folder-open
            </w-icon>
        </template>
        <template #base-content>
            <input v-if="isActivityCandidate(activity.id)"
                   type="text"
                   v-model="activityCandidateName"
                   @blur="onActivityCandidateLoseFocus"
                   @keyup.enter="commitActivityCreation"
                   ref="activityCandidateInput"
            />
            <h4 v-else :title="activity.name">{{ activity.name }}</h4>
        </template>
        <template #action-items>
            <div v-if="isActivityCandidate(activity.id)" class="activity-tree-item__action-items-area">
                <w-icon class="color-cancel activities-tree__new-activity--action-item" @click="cancelActivityCreation">
                    mdi mdi-close-circle-outline
                </w-icon>
                <w-icon class="color-ok activities-tree__new-activity--action-item" @click="commitActivityCreation">
                    mdi mdi-check-circle-outline
                </w-icon>
            </div>
            <hy-menu v-else stick-to="right-top">
                <template #actuator>
                    <div class="activity-tree-item__action-items-area activity-tree-item__action-items-area--options">
                        <w-icon>mdi mdi-dots-horizontal</w-icon>
                    </div>
                </template>
                <template #menu-area>
                    <ul>
                        <activity-menu-item v-if="activity.group && level < 2" @click.prevent="createActivityCandidate(true, activity.id)">
                            <template #left-icon>
                                <w-icon>mdi mdi-folder-plus-outline</w-icon>
                            </template>
                            <template #base-content>
                                <h3>Create activity group</h3>
                            </template>
                        </activity-menu-item>
                        <activity-menu-item v-if="activity.group && level < 3" @click.prevent="createActivityCandidate(false, activity.id)">
                            <template #left-icon>
                                <w-icon>mdi mdi-rocket-launch</w-icon>
                            </template>
                            <template #base-content>
                                <h3>Create activity</h3>
                            </template>
                        </activity-menu-item>
                        <activity-menu-item @click.prevent="copyToClipboard(activity.id)">
                            <template #left-icon>
                                <w-icon>mdi mdi-content-copy</w-icon>
                            </template>
                            <template #base-content>
                                <h3>Copy link</h3>
                            </template>
                        </activity-menu-item>
                        <activity-menu-item @click.prevent="createActivityCandidate(false, activity.id)">
                            <template #left-icon>
                                <w-icon>mdi mdi-rename</w-icon>
                            </template>
                            <template #base-content>
                                <h3>Rename</h3>
                            </template>
                        </activity-menu-item>
                        <activity-menu-item @click.prevent="createActivityCandidate(false, activity.id)">
                            <template #left-icon>
                                <w-icon>mdi mdi-delete</w-icon>
                            </template>
                            <template #base-content>
                                <h3>Delete</h3>
                            </template>
                        </activity-menu-item>
                    </ul>
                </template>
            </hy-menu>
        </template>
        <template #additional-content v-if="activity.group && activity.child_activities && activity.child_activities.length !== 0">
            <ul :class="{'activity-items--closed': !activity.opened}" class="activities-tree__items">
                <activities-tree-item
                        v-for="child in activity.child_activities"
                        :key="child.id"
                        :activity="child"
                        :level="level + 1"
                />
            </ul>
        </template>
    </hy-list-item>
</template>

<script>

import { useClipboard } from '@vueuse/core';
const { copy } = useClipboard();

import activitiesService from "@/services/activities-service.js";
import HyListItem from "@/components/basic/elements/HyListItem.vue";
import HyMenu from "@/components/basic/elements/HyMenu.vue";
import ActivityMenuItem from "@/components/activities/ActivityMenuItem.vue";

export default {
    name: 'activities-tree-item',
    components: {HyMenu, HyListItem, ActivityMenuItem},
    data() {
        return {
            activityCandidateName: undefined,
            expandLevelChanges: 0,
            currentExpandLevel: 0,
        }
    },
    props: ['activity', 'level'],
    methods: {
        copyToClipboard(activityId) {
            copy(activityId);
        },
        isActivityCandidate(activityId) {
            return !activityId || activityId === activitiesService.activityCandidateId;
        },
        onActivityCandidateLoseFocus() {
            const activityCandidateInput = this.$refs.activityCandidateInput;
            if (activityCandidateInput) {
                setTimeout(function () {
                    activityCandidateInput.focus();
                }, 20);
            }
        },
        createActivityCandidate(group, parentActivityId) {
            this.$store.dispatch('activities/createActivityCandidate', {group, parentActivityId});
        },
        cancelActivityCreation() {
            this.$store.commit('activities/removeActivity', activitiesService.activityCandidateId);
        },
        commitActivityCreation() {
            this.$store.commit('activities/commitActivityCreation');
        },
        routeTo(activityId) {
            if (this.isActivityCandidate(activityId)) {
                return undefined;
            }
            return `/activities/${activityId}`;
        },
        collapseGroup(activityId) {
            const activity = this.activitiesMap.get(activityId);
            if (activity) {
                activity.opened = false;
                this.expandLevelChanges--;
            }
        },
        expandGroup(activityId) {
            const activity = this.activitiesMap.get(activityId);
            if (activity) {
                activity.opened = true;
                this.expandLevelChanges++;
            }
        },
    },
    computed: {
        activitiesMap() {
            return this.$store.getters['activities/activitiesMap'];
        },
        activities() {
            return this.$store.getters['activities/activities'];
        },
    },
    watch: {
        expandLevelChanges() {
            this.$store.commit('activities/refreshCurrentExpandLevel');
        },
        activityCandidateName(newValue) {
            this.$store.commit('activities/refreshActivityCandidatePosition', newValue);
        },
    },
    mounted() {
        this.onActivityCandidateLoseFocus();
    },
}
</script>

<style scoped>

.activity-items--closed {
    display: none;
}

.activity-tree-item__action-items-area {
    display: flex;
    height: 2.2rem;
    justify-content: center;
    align-items: center;
    padding: 0 0.8rem 0 0;
    gap: 0.2rem;
}

.activity-tree-item__action-items-area--options {
    opacity: 0;
    color: #444343;
}

.activity_item__menu-actuator i {
    color: #909090;
}

.activities-tree__items .list-item__container:active .activity-tree-item__action-items-area--options,
.activities-tree__items .list-item__container:hover .activity-tree-item__action-items-area--options {
    opacity: 1;
}

.router-link-active.list-item__container .list-item__left-icon-area i.activity_item__icon-activity {
    color: #B243C5;
}

.router-link-active.list-item__container .list-item__left-icon-area i.activity_item__icon-activity-group {
    color: #1a6207;
}

i.activities-tree__new-activity--action-item {
    font-size: 1.4rem;
    cursor: pointer;
}

</style>
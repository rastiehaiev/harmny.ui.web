<template>
    <hy-list-item :key="activity.id"
                  :route-to="routeTo(activity.id)"
                  :level="level"
                  :error-code="activity.errorCode"
                  padding-left="1.2rem"
                  cursor="pointer">
        <template #content>
            <hy-list-item-content>
                <template #left-icon>
                    <w-icon class="activity_item__icon-activity" v-if="!activity.group">
                        mdi mdi-rocket-launch
                    </w-icon>
                    <w-icon class="activity_item__icon-activity-group" v-else-if="!activity.child_activities || activity.child_activities.length === 0">
                        mdi mdi-folder-outline
                    </w-icon>
                    <w-icon class="activity_item__icon-activity-group" @click.prevent="expandGroup(activity)" v-else-if="!activity.opened">
                        mdi mdi-folder
                    </w-icon>
                    <w-icon class="activity_item__icon-activity-group" @click.prevent="collapseGroup(activity)" v-else>
                        mdi mdi-folder-open
                    </w-icon>
                </template>
                <template #base-content>
                    <input v-if="activity.id === activityInEditModeId"
                           type="text"
                           :disabled="activity.operationInProgress"
                           v-model.trim="activityInEditModeName"
                           @blur="onActivityCandidateLoseFocus"
                           @keyup.enter="commitActivityEditMode(activity.id)"
                           ref="activityInEditModeInputRef"
                           @click.prevent
                    />
                    <h4 v-else :title="activity.name">{{ activity.name }}</h4>
                </template>
                <template #action-items>
                    <div v-if="activity.operationInProgress" class="activity-tree-item__action-items-area">
                        <w-progress circle color="yellow" bg-color="cyan"></w-progress>
                    </div>
                    <div v-else-if="activity.id === activityInEditModeId" class="activity-tree-item__action-items-area">
                        <w-icon class="activities-tree__new-activity--action-item color-cancel" @click="cancelActivityEditMode">
                            mdi mdi-close-circle-outline
                        </w-icon>
                        <w-icon v-if="!activity.errorCode" class="activities-tree__new-activity--action-item color-ok" @click="commitActivityEditMode(activity.id)">
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
                            <activities-tree-item-menu @on-activity-edit="(name) => onActivityEditStarted(name)" :activity="activity" :level="level"></activities-tree-item-menu>
                        </template>
                    </hy-menu>
                </template>
            </hy-list-item-content>
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

import {nextTick} from "vue";
import activitiesUtils from "@/utils/activities-utils";
import HyMenu from "@/components/basic/elements/HyMenu.vue";
import HyListItem from "@/components/basic/elements/HyListItem.vue";
import HyListItemContent from "@/components/basic/elements/HyListItemContent.vue";
import ActivitiesTreeItemMenu from "@/components/activities/ActivitiesTreeItemMenu.vue";

export default {
    name: 'activities-tree-item',
    components: {ActivitiesTreeItemMenu, HyMenu, HyListItemContent, HyListItem},
    data() {
        return {
            expandLevelChanges: 0,
            activityInEditModeName: undefined,
        }
    },
    props: {
        activity: {
            required: true,
        },
        level: {
            type: Number,
            default: 0,
        },
    },
    methods: {
        routeTo(activityId) {
            return !activitiesUtils.isActivityCandidate(activityId) ? `/activities/${activityId}` : undefined;
        },
        onActivityEditStarted(name) {
            this.activityInEditModeName = name;
            this.onActivityCandidateLoseFocus();
        },
        cancelActivityEditMode() {
            this.$store.dispatch('activities/cancelActivityEditMode');
        },
        commitActivityEditMode() {
            const errorResponseMaybe = this.$store.dispatch('activities/commitActivityInEditMode');
            errorResponseMaybe.then((result) => {
                if (result) {
                    const {errorCode, activityId} = result;
                    if (errorCode) {
                        console.log(errorCode);
                    } else if (activityId) {
                        this.$router.push({name: 'activity', params: {activityId}});
                    }
                }
            });
        },
        onActivityCandidateLoseFocus() {
            nextTick().then(() => {
                const activityInEditModeInputRef = this.$refs.activityInEditModeInputRef;
                if (activityInEditModeInputRef) {
                    activityInEditModeInputRef.focus();
                }
            });
        },
        collapseGroup(activity) {
            if (activity) {
                activity.opened = false;
                this.expandLevelChanges--;
            }
        },
        expandGroup(activity) {
            if (activity) {
                activity.opened = true;
                this.expandLevelChanges++;
            }
        },
    },
    computed: {
        activityInEditModeId() {
            return this.$store.getters['activities/activityInEditModeId'];
        },
    },
    watch: {
        expandLevelChanges() {
            this.$store.commit('activities/refreshCurrentExpandLevel');
        },
        activityInEditModeName(newValue) {
            this.$store.commit('activities/refreshEditedActivityPosition', newValue);
            this.$store.commit('activities/validateEditedActivity');
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

.activity-tree-item__action-items-area div.w-progress {
    width: 1.2rem;
}

.activity-tree-item__action-items-area--options {
    opacity: 0;
    color: var(--color-gray-4);
}

.activity_item__menu-actuator i {
    color: var(--color-gray-2);
}

.activities-tree__items .hy-list-item__container:active .activity-tree-item__action-items-area--options,
.activities-tree__items .hy-list-item__container:hover .activity-tree-item__action-items-area--options {
    opacity: 1;
}

.hy-list-item__container.router-link-active .hy-list-item-content .hy-list-item-content__left-icon-area i.activity_item__icon-activity {
    color: var(--color-magenta-1);
}

.hy-list-item__container.router-link-active .hy-list-item-content .hy-list-item-content__left-icon-area i.activity_item__icon-activity-group {
    color: var(--color-green-2);
}

.activities-tree__new-activity--action-item {
    font-size: 1.4rem;
    cursor: pointer;
}
</style>
<template>
    <ListItem :key="activity.id" :route-to="routeTo(activity.id)" :level="level">
        <template #left-icon>
            <icon-activities-activity v-if="!activity.group"/>
            <icon-activities-activity-group-empty v-else-if="!activity.child_activities || activity.child_activities.length === 0"/>
            <icon-activities-activity-group-closed @click.prevent="expandGroup(activity.id)" v-else-if="!activity.opened"/>
            <icon-activities-activity-group-open @click.prevent="collapseGroup(activity.id)" v-else/>
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
            <template v-if="isActivityCandidate(activity.id)">
                <icon-cancel class="activities-tree__new-activity--action-item" @click="cancelActivityCreation"/>
                <icon-ok class="activities-tree__new-activity--action-item" @click="commitActivityCreation"/>
            </template>
            <icon-more-dots
                v-else
                @click.prevent="this.$emit('emitActivityCreation', false, activity.id)"
                class="activity-items__more-button"/>
        </template>
        <template #additional-content v-if="activity.group && activity.child_activities && activity.child_activities.length !== 0">
            <ul :class="{'activity-items--closed': !activity.opened}" class="activities-tree__items">
                <activity-item
                        v-for="child in activity.child_activities"
                        :key="child.id"
                        :activity="child"
                        :level="level + 1"
                        @onActivityCreateAttempt="(group, parent) => emitActivityCreation(group, parent)"
                        @emitActivityCreation="(group, parent) => emitActivityCreation(group, parent)"
                />
            </ul>
        </template>
    </ListItem>
</template>

<script>

import ListItem from "@/components/basic/elements/ListItem.vue";
import activitiesService from "@/services/activities-service.js";

export default {
    name: 'activity-item',
    components: {ListItem},
    data() {
        return {
            activityCandidateName: undefined,
            expandLevelChanges: 0,
            currentExpandLevel: 0,
        }
    },
    props: ['activity', 'level'],
    emits: ['onActivityCreateAttempt', 'emitActivityCreation'],
    methods: {
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
        emitActivityCreation(group, parent) {
            this.$emit('onActivityCreateAttempt', group, parent);
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

.activity-items__more-button {
    opacity: 0;
    width: 1.4rem;
    height: 1.4rem;
    fill: #909090;
}

.activities-tree__items .list-item__container:hover .activity-items__more-button {
    opacity: 1;
}

.activity-item__area-actions svg {
    width: 1.4rem;
    height: 1.4rem;
    fill: #909090;
}

.router-link-active.list-item__container .list-item__left-icon-area svg {
    fill: #B243C5;
}

svg.activities-tree__new-activity--action-item {
    width: 1.4rem;
    height: 1.4rem;
    cursor: pointer;
}

</style>
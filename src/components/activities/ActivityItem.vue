<template>
    <li class="activity-item" :key="activity.id">
        <router-link :to="`/activities/${activity.id}`"
                     class="activity-item__link"
                     :class="{ 'activity-item__link--current': activity.id === this.$route.params.activityId }"
                     :style="{ '--level': level }">
            <div class="activity-item__area-name">
                <icon-activities-activity class="activity-item__link--icon--activity" v-if="!activity.group"/>
                <icon-activities-activity-group-empty class="activity-item__link--icon--dir" v-else-if="!activity.child_activities || activity.child_activities.length === 0"/>
                <icon-activities-activity-group-closed class="activity-item__link--icon--dir" @click.prevent="expandGroup(activity.id)" v-else-if="!activity.opened"/>
                <icon-activities-activity-group-open class="activity-item__link--icon--dir" @click.prevent="collapseGroup(activity.id)" v-else/>
                <span :title="activity.name">{{ activity.name }}</span>
            </div>
            <div class="activity-item__area-actions">
                <icon-more-dots @click.prevent="greet"/>
            </div>
        </router-link>
        <ul :class="{'activity-items--closed': !activity.opened}" class="activity-items" v-if="activity.group && activity.child_activities && activity.child_activities.length !== 0">
            <activity-item v-for="child in activity.child_activities" :key="child.id" :activity="child" :level="level + 1"></activity-item>
        </ul>
    </li>
</template>

<script>

import IconMoreDots from "@/components/basic/icons/IconMoreDots.vue";

export default {
    name: 'activity-item',
    components: {IconMoreDots},
    data() {
        return {
            expandLevelChanges: 0,
            currentExpandLevel: 0,
        }
    },
    props: ['activity', 'level'],
    methods: {
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
        greet() {
            alert('Hello!')
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
    },
    beforeMount() {
        this.$store.commit('activities/refreshCurrentExpandLevel');
    },
}
</script>

<style scoped>
.activity-items--closed {
    display: none;
}

.activity-item__link {
    display: flex;
    text-decoration: none;
    padding: 0.3rem 0.8rem 0.3rem 1.2rem;
    justify-content: space-between;
}

.activity-item__link:hover .activity-item__area-actions {
    opacity: 1;
}

.activity-item__area-name {
    padding-left: calc(var(--level, 0) * 0.7rem);
    max-width: 14rem;
}

.activity-item__area-actions {
    opacity: 0;
}

.activity-item__area-name,
.activity-item__area-actions {
    display: flex;
    align-items: center;
    flex-shrink: 3;
}

.activity-item__area-actions svg {
    width: 1.4rem;
    height: 1.4rem;
    fill: #909090;
}

.activity-item__link span {
    color: #444343;
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.activity-item__area-name svg {
    height: 1rem;
    width: 1rem;
    fill: #909090;
    margin-right: 0.5rem;
    flex-shrink: 0;
}

.activity-item__link:hover,
.activity-item__link:active {
    background-color: rgba(15, 200, 231, 0.08);
}

.activity-item__link--current,
.activity-item__link--current:hover {
    font-weight: 400;
    background-color: #0FC8E71F;
}

.activity-item__link:hover .activity-item__area-name svg,
.activity-item__link:active .activity-item__area-name svg {
    fill: #606060;
}

.activity-item__link--current .activity-item__area-name .activity-item__link--icon--activity,
.activity-item__link--current:hover .activity-item__area-name .activity-item__link--icon--activity,
.activity-item__link--current:active .activity-item__area-name .activity-item__link--icon--activity {
    fill: #B243C5;
}

.activity-item__link--current .activity-item__area-name .activity-item__link--icon--dir,
.activity-item__link--current:hover .activity-item__area-name .activity-item__link--icon--dir,
.activity-item__link--current:active .activity-item__area-name .activity-item__link--icon--dir {
    fill: #1e7307;
}

</style>
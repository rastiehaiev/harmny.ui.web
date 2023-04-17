<template>
    <section class="activities-tree-section">
        <header class="activities-tree__action-items">
            <h3>Activities Tree</h3>
            <div class="activities-tree__action-items--container">
                <icon-activities-action-items-new-folder class="activities-tree__action-items--unavailable-collapsed"/>
                <icon-activities-action-items-collapse-vertical
                    v-if="this.currentExpandLevel > 0"
                    class="activities-tree__action-items--unavailable-collapsed"
                    @click="collapseOneLevelVertical"
                />
                <icon-activities-action-items-expand-vertical
                    v-if="this.currentExpandLevel === 0"
                    class="activities-tree__action-items--unavailable-collapsed"
                    @click="expandAllVertical"
                />
                <icon-activities-action-items-collapse class="activities-tree__action-items--available-collapsed"/>
            </div>
        </header>
        <div class="activities-tree">
            <ul class="activity--items">
                <activity-item v-for="activity in activities" :key="activity.id" :activity="activity" :level="0"></activity-item>
            </ul>
        </div>
    </section>
</template>

<script>

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
                    collapseVertical(activity.child_activities, level -1);
                }
            });
        }
    }
}

export default {
    name: 'activities-tree',
    components: {ActivityItem},
    methods: {
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
        }
    },
    computed: {
        activities() {
            return this.$store.getters['activities/activities'];
        },
        currentExpandLevel() {
            return this.$store.getters['activities/currentExpandLevel'];
        },
    },
}
</script>

<style>
.activities-tree-section {
    width: 2.8rem;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #EAEAEA;
    background-color: rgba(186, 224, 223, 0.09);
    /* 100% - breadcrumbs height - footer height */
    height: calc(100% - 3.6rem - 4rem);
}

.activities-tree__action-items {
    height: 1.6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.4rem 0.4rem 0.4rem 1.2rem;
    transform: rotateZ(-90deg) translateX(-7.2rem) translateY(0.2rem);
    transform-origin: 2.2rem 2.2rem;
    min-width: 9.6rem;
}

.activities-tree__action-items h3 {
    font-size: 1rem;
    font-weight: 350;
    color: #ACABAB;
}

@media only screen and (min-width: 50rem) {
    .activities-tree-section {
        height: 100%;
        width: 20rem;
    }

    .activities-tree__action-items {
        transform: none;
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
}

.activities-tree {
    display: none;
}

.activities-tree__action-items--available-collapsed {
    display: block;
    transform: rotateZ(-90deg);
    transform-origin: 0.7rem 0.7rem;
}

.activities-tree__action-items--unavailable-collapsed {
    display: none;
}

@media only screen and (min-width: 50rem) {
    .activities-tree {
        display: flex;
        flex-direction: column;
        width: 100%;
        overflow-y: auto;
        /* 100% - breadcrumbs height - activities tree header height */
        height: calc(100% - 3.6rem - 1.6rem);
        padding-bottom: 2rem;
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
        display: none;
    }

    .activities-tree:hover::-webkit-scrollbar {
        display: block;
    }

    .activities-tree::-webkit-scrollbar-thumb {
        background-color: #0FC8E71F;
        border-radius: 0.2rem;
    }

    .activities-tree__action-items--unavailable-collapsed {
        display: block;
    }

    .activities-tree__action-items--available-collapsed {
        transform: none;
    }
}
</style>
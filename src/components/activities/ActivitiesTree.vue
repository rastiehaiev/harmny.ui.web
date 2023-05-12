<template>
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
</template>

<script>

import ActivitiesTreeItem from "@/components/activities/ActivitiesTreeItem.vue";

export default {
    name: 'activities-tree',
    components: {ActivitiesTreeItem},
    props: {
        activities: {
            default: undefined,
        },
    },
    computed: {
        activitiesLoadingInProgress() {
            return this.$store.getters['activities/activitiesLoadingInProgress'];
        },
    },
}
</script>

<style scoped>
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
</style>
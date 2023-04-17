<template>
    <div class="app-content__main">
        <activities-tree></activities-tree>
        <section class="activity-section"></section>
    </div>
</template>

<script>

import ActivitiesTree from "@/components/activities/ActivitiesTree.vue";

export default {
    data() {
        return {}
    },
    components: {
        ActivitiesTree,
    },
}
</script>

<style>
.app-content__main {
    display: flex;
    flex-direction: row;
    height: 100%;
}

.activity-section {
    display: flex;
    flex-grow: 1;
}
</style>

<template>
    <div class="app-content__main">
        <activities-tree></activities-tree>
        <section class="activity-section">

        </section>
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
.activity-section {
    flex-grow: 10;
    display: flex;
}

.activity-section i {
    font-size: 2.4rem;
}
</style>

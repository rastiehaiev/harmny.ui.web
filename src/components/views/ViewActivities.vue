<template>
    <app-side-bar></app-side-bar>
    <app-bread-crumbs></app-bread-crumbs>
    <section class="app-content">
        <div class="app-content__main">
            <activities-tree-side-bar></activities-tree-side-bar>
            <section class="activity-section"></section>
        </div>
    </section>

</template>

<script>
import ActivitiesTreeSideBar from "@/components/activities/ActivitiesTreeSideBar.vue";

export default {
    components: {
        ActivitiesTreeSideBar,
    },
    methods: {
        updateLastActivityId(route) {
            const activityId = route.params ? route.params.activityId : undefined;
            if (activityId) {
                this.$store.commit('updateLastActivityId', activityId);
            }
        }
    },
    watch: {
        $route(newValue) {
            if (newValue.name === 'activity') {
                this.updateLastActivityId(newValue);
            } else if (newValue.name === 'activities') {
                this.$store.commit('updateLastActivityId', undefined);
            }
        }
    },
    mounted() {
        const route = this.$route;
        if (route.name === 'activities' && !route.params.activityId) {
            const lastActivityId = this.$store.getters.lastActivityId;
            if (lastActivityId) {
                this.$router.push({name: 'activity', params: {activityId: lastActivityId}});
            }
        } else if (route.name === 'activity') {
            this.updateLastActivityId(route);
        }
    },
}
</script>

<style>
.activity-section {
    flex-grow: 10;
    display: flex;
}

</style>

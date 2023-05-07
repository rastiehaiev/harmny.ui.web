import {createRouter, createWebHistory} from "vue-router";
import ViewActivities from "@/components/views/ViewActivities.vue";
import ViewRoutines from "@/components/views/ViewRoutines.vue";
import ViewGoals from "@/components/views/ViewGoals.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            redirect: "/activities"
        },
        {
            name: 'activities',
            path: "/activities",
            component: ViewActivities,
        },
        {
            name: 'activity',
            path: "/activities/:activityId",
            component: ViewActivities,
        },
        {
            name: 'routines',
            path: "/routines",
            component: ViewRoutines,
        },
        {
            name: 'goals',
            path: "/goals",
            component: ViewGoals,
        },
    ]
});

export default router;

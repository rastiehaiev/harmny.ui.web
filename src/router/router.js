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
            path: "/activities",
            component: ViewActivities,
        },
        {
            path: "/activities/:activityId",
            component: ViewActivities,
        },
        {
            path: "/routines",
            component: ViewRoutines,
        },
        {
            path: "/goals",
            component: ViewGoals,
        },
    ]
});

export default router;

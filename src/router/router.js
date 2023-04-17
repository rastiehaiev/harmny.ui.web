import {createRouter, createWebHistory} from "vue-router";
import ViewActivities from "@/components/views/ViewActivities.vue";

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
            redirect: "/activities"
        },
        {
            path: "/goals",
            redirect: "/activities"
        },
    ]
});

export default router;

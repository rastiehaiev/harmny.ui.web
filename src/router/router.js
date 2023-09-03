import {createRouter, createWebHistory} from "vue-router";
import ViewActivities from "@/components/views/ViewActivities.vue";
import ViewRoutines from "@/components/views/ViewRoutines.vue";
import ViewGoals from "@/components/views/ViewGoals.vue";
import ViewSignIn from "@/components/views/ViewSignIn.vue";
import ViewSignUp from "@/components/views/ViewSignUp.vue";
import ViewSignOut from "@/components/views/ViewSignOut.vue";

import appStorage from "@/utils/app-storage";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/sign-in",
            component: ViewSignIn,
            meta: {
                authRequired: false,
            },
        },
        {
            path: "/sign-up",
            component: ViewSignUp,
            meta: {
                authRequired: false,
            },
        },
        {
            path: "/sign-out",
            component: ViewSignOut,
            meta: {
                authRequired: true,
            },
        },
        {
            path: "/",
            redirect: "/activities",
        },
        {
            name: 'activities',
            path: "/activities",
            component: ViewActivities,
            meta: {
                authRequired: true,
            },
        },
        {
            name: 'activity',
            path: "/activities/:activityId",
            component: ViewActivities,
            meta: {
                authRequired: true,
            },
        },
        {
            name: 'routines',
            path: "/routines",
            component: ViewRoutines,
            meta: {
                authRequired: true,
            },
        },
        {
            name: 'goals',
            path: "/goals",
            component: ViewGoals,
            meta: {
                authRequired: true,
            },
        },
    ]
});

router.beforeEach((to, from, next) => {
    let authRequired = to.matched.some(value => value.meta.authRequired);
    let token = appStorage.getToken();
    if (authRequired && !token) {
        next("/sign-in");
    } else {
        next();
    }
});

export default router;

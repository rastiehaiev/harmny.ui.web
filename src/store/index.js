import {createStore} from 'vuex';

import activitiesModule from '@/store/activities/index.js';
import notificationsModule from '@/store/notifications/index.js';
import mutations from "@/store/mutations.js";
import getters from "@/store/getters.js";

const store = createStore({
    state: {
        mobile: false,
    },
    mutations,
    getters,
    modules: {
        activities: activitiesModule,
        notifications: notificationsModule,
    },
});

export default store;
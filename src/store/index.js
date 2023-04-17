import {createStore} from 'vuex';

import activitiesModule from '@/store/activities/index.js';

const store = createStore({
    modules: {
        activities: activitiesModule,
    }
});

export default store;
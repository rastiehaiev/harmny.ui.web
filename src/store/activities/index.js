import mutations from '@/store/activities/mutations.js';
import getters from '@/store/activities/getters.js';
import actions from '@/store/activities/actions.js';

export default {
    namespaced: true,
    state() {
        return {
            activities: undefined,
            activitiesMap: undefined,
            activityInEditMode: undefined,
            currentExpandLevel: 0,
        }
    },
    mutations,
    getters,
    actions,
};

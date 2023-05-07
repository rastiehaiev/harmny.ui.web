export default {
    activities(state) {
        return state.activities;
    },
    activitiesMap(state) {
        return state.activitiesMap;
    },
    activityInEditMode(state) {
        return state.activityInEditMode;
    },
    activityInEditModeId(state) {
        const activityInEditMode = state.activityInEditMode;
        return activityInEditMode ? activityInEditMode.id : undefined;
    },
    currentExpandLevel(state) {
        return state.currentExpandLevel;
    },
};
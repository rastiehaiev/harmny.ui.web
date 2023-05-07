import activitiesUtils from "@/utils/activities-utils";
import activitiesService from "@/services/activities-service.js";

export default {
    applyFreshActivities(context, payload) {
        if (payload) {
            const {activities} = payload;
            const currentActivities = context.getters.activities;
            if (currentActivities) {
                // refresh activities
                const currentActivitiesMap = context.getters.activitiesMap;
                activitiesUtils.applyFromExisting(activities, currentActivitiesMap);
            }
            context.commit('applyFreshActivities', activities);
        }
    },
    startActivityCreation(context, payload) {
        const {group, parentActivityId} = payload;
        const state = context.state;
        let parentActivity = undefined;
        if (parentActivityId) {
            parentActivity = state.activitiesMap.get(parentActivityId);
            if (!parentActivity) {
                console.log(`No parent activity found by id='${parentActivityId}'.`);
                return;
            }
            if (!parentActivity.group) {
                console.log(`Parent activity '${parentActivityId}' is not a group.`);
                return;
            }
        }

        const existingActivityInEditMode = state.activityInEditMode;
        if (existingActivityInEditMode) {
            context.commit('removeActivityInEditMode');
        }
        if (!existingActivityInEditMode ||
            (existingActivityInEditMode && (
                    existingActivityInEditMode.parent_activity_id !== parentActivityId
                    || !activitiesUtils.isActivityCandidate(existingActivityInEditMode.id))
            )
        ) {
            context.commit('startActivityCreation', {group, parentActivityId});
        }
    },
    startActivityRenaming(context, payload) {
        const {activityId} = payload;
        context.commit('removeActivityInEditMode');
        context.commit('startActivityRenaming', activityId);
    },
    cancelActivityEditMode(context) {
        const activityInEditMode = context.getters.activityInEditMode;
        if (activityInEditMode) {
            context.commit('removeActivityInEditMode');
        }
    },
    commitActivityCreation(context) {
        const activityInEditMode = context.getters.activityInEditMode;
        if (activityInEditMode && activitiesUtils.isActivityCandidate(activityInEditMode.id)) {
            activityInEditMode.operationInProgress = true;
            console.log(`Creating new activity: ${activityInEditMode.name}.`);
            return activitiesService.create(activityInEditMode)
                .then((activity) => {
                    context.commit('onActivityCreationSucceeded', activity.id);
                    console.log(activity.id);
                    return {activityId: activity.id};
                })
                .catch((error) => {
                    activityInEditMode.operationInProgress = false;
                    return {error};
                });
        }
        return Promise.resolve();
    },
    commitActivityRenaming(context) {
        const activityInEditMode = context.getters.activityInEditMode;
        if (activityInEditMode && !activitiesUtils.isActivityCandidate(activityInEditMode.id)) {
            activityInEditMode.operationInProgress = true;
            return activitiesService.rename(activityInEditMode.id, activityInEditMode.name)
                .then((activity) => {
                    context.commit('onActivityRenamingSucceeded', activity);
                    return {activityId: activity.id};
                }).catch((error) => {
                    activityInEditMode.operationInProgress = false;
                    return {error};
                });
        }
        return Promise.resolve();
    },
};
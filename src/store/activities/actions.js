import activitiesUtils from "@/utils/activities-utils";
import activitiesService from "@/services/activities-service.js";
import validationService from "@/services/validation-service";

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
    commitActivityInEditMode(context) {
        const activityInEditMode = context.getters.activityInEditMode;
        if (activityInEditMode) {
            const activities = context.getters.activities;
            const activitiesMap = context.getters.activitiesMap;
            const validationErrorCode = validationService.validateEditedActivity(activityInEditMode, activities, activitiesMap);
            if (validationErrorCode) {
                activityInEditMode.errorCode = validationErrorCode;
                console.log(validationErrorCode);
            } else {
                activityInEditMode.operationInProgress = true;
                if (activitiesUtils.isActivityCandidate(activityInEditMode.id)) {
                    return activitiesService.create(activityInEditMode)
                        .then((activity) => {
                            context.commit('onActivityCreationSucceeded', activity.id);
                            return {activityId: activity.id};
                        })
                        .catch((error) => {
                            activityInEditMode.operationInProgress = false;
                            const {failure} = error.response.data;
                            let errorCode = 'unknown';
                            if (failure) {
                                const {type} = failure;
                                errorCode = type;
                            }
                            activityInEditMode.errorCode = errorCode;
                            return {errorCode};
                        });
                } else {
                    return activitiesService.rename(activityInEditMode.id, activityInEditMode.name)
                        .then((activity) => {
                            context.commit('onActivityRenamingSucceeded', activity);
                            return {activityId: activity.id};
                        }).catch((error) => {
                            activityInEditMode.operationInProgress = false;
                            const {failure} = error.response.data;
                            let errorCode = 'unknown';
                            if (failure) {
                                const {type} = failure;
                                errorCode = type;
                            }
                            activityInEditMode.errorCode = errorCode;
                            return {errorCode};
                        });
                }
            }
        }
        return Promise.resolve();
    },
    deleteActivity(context, activityId) {
        if (activityId) {
            const activity = context.getters.activitiesMap.get(activityId);
            if (activity) {
                activity.operationInProgress = true;
                return activitiesService.delete(activityId)
                    .then(() => {
                        context.commit('onActivityDeleted', activityId);
                        return {activityId};
                    }).catch((error) => {
                        activity.operationInProgress = false;
                        return {error};
                    });
            }
        }
    },
    moveActivity(context, {activityId, newParentActivityId}) {
        if (activityId) {
            const activity = context.getters.activitiesMap.get(activityId);
            if (activity) {
                activity.operationInProgress = true;
                return activitiesService.move(activity, newParentActivityId)
                    .then(() => {
                        context.commit('onActivityMoved', {activity, newParentActivityId});
                        activity.parent_activity_id = newParentActivityId;
                        activity.operationInProgress = false;
                        return {activityId};
                    }).catch((error) => {
                        activity.operationInProgress = false;
                        return {error};
                    });
            }
        }
    },
};
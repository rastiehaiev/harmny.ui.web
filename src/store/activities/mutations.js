import activitiesUtils from "@/utils/activities-utils.js";
import validationService from "@/services/validation-service.js";

function sortContainingGroup(activity, activities, activitiesMap) {
    if (activity && activitiesMap) {
        let targetActivities = undefined;
        if (!activity.parent_activity_id) {
            targetActivities = activities;
        } else {
            const parentActivity = activitiesMap.get(activity.parent_activity_id);
            if (parentActivity) {
                targetActivities = parentActivity.child_activities;
            }
        }
        if (targetActivities) {
            activitiesUtils.sort(targetActivities);
        }
    }
}

export default {
    applyFreshActivities(state, activities) {
        const newActivities = activities ? activities : [];
        state.activities = newActivities;
        state.activitiesMap = activitiesUtils.toMap(newActivities);
    },
    openAllInActivityHierarchy(state, activityId) {
        activitiesUtils.openAllInActivityHierarchy(state.activitiesMap, activityId);
    },
    startActivityCreation(state, payload) {
        const {group, parentActivityId} = payload;
        let parentActivity = undefined;
        let targetActivities = undefined;
        if (!parentActivityId) {
            targetActivities = state.activities;
        } else {
            parentActivity = state.activitiesMap.get(parentActivityId);
            if (parentActivity) {
                let childActivities = parentActivity.child_activities;
                if (!childActivities) {
                    childActivities = [];
                    parentActivity.child_activities = childActivities;
                }
                targetActivities = childActivities;
            }
        }
        if (targetActivities) {
            const activity = {
                id: activitiesUtils.activityCandidateId,
                name: '',
                group,
                parent_activity_id: parentActivityId,
            }
            targetActivities.unshift(activity);
            activitiesUtils.sort(targetActivities);
            state.activitiesMap.set(activity.id, activity);
            state.activityInEditMode = activity;
            if (parentActivity) {
                parentActivity.opened = true;
            }
        }
    },
    startActivityRenaming(state, activityId) {
        if (activityId) {
            const existingActivity = state.activitiesMap.get(activityId);
            if (existingActivity) {
                existingActivity.nameBackup = existingActivity.name;
                state.activityInEditMode = existingActivity;
            }
        }
    },
    removeActivityInEditMode(state) {
        const activityInEditMode = state.activityInEditMode;
        if (activityInEditMode) {
            if (activitiesUtils.isActivityCandidate(activityInEditMode.id)) {
                // TODO reimplement using activities map
                activitiesUtils.deleteById(activityInEditMode.id, state.activities);
                state.activitiesMap.delete(activityInEditMode.id);
            } else {
                activityInEditMode.name = activityInEditMode.nameBackup;
                activityInEditMode.nameBackup = undefined;
                activityInEditMode.errorCode = undefined;
                sortContainingGroup(activityInEditMode, state.activities, state.activitiesMap);
            }
            state.activityInEditMode = undefined;
        }
    },
    onActivityCreationSucceeded(state, generatedActivityId) {
        if (generatedActivityId) {
            const activityInEditMode = state.activityInEditMode;
            if (activityInEditMode && activitiesUtils.isActivityCandidate(activityInEditMode.id)) {
                state.activitiesMap.delete(activityInEditMode.id);
                activityInEditMode.id = generatedActivityId;
                state.activitiesMap.set(generatedActivityId, activityInEditMode);
                state.activityInEditMode = undefined;
                activityInEditMode.operationInProgress = false;
            }
        } else {
            console.log('ID of generated activity is undefined.');
        }
    },
    onActivityRenamingSucceeded(state, activity) {
        if (activity) {
            const activityInEditMode = state.activityInEditMode;
            if (activityInEditMode && activityInEditMode.id === activity.id) {
                activityInEditMode.nameBackup = undefined;
                activityInEditMode.name = activity.name;
                state.activityInEditMode = undefined;
                activityInEditMode.operationInProgress = false;
            }
        } else {
            console.log('Activity object is undefined for renamed activity.');
        }
    },
    onActivityDeleted(state, activityId) {
        // TODO reimplement using activities map
        activitiesUtils.deleteById(activityId, state.activities);
        state.activitiesMap.delete(activityId);
    },
    onActivityMoved(state, {activity, newParentActivityId}) {
        let currentParent = undefined;
        const currentParentActivityId = activity.parent_activity_id;
        if (currentParentActivityId) {
            currentParent = state.activitiesMap.get(currentParentActivityId);
        }
        let newParent = undefined;
        if (newParentActivityId) {
            newParent = state.activitiesMap.get(newParentActivityId);
        }
        if (currentParent) {
            activitiesUtils.deleteById(activity.id, currentParent.child_activities)
        }
        if (newParent) {
            if (!newParent.child_activities) {
                newParent.child_activities = [activity];
            } else {
                newParent.child_activities.unshift(activity);
                activitiesUtils.sort(newParent.child_activities);
            }
        }
    },
    refreshEditedActivityPosition(state, newValue) {
        const activityInEditMode = state.activityInEditMode;
        if (activityInEditMode) {
            activityInEditMode.name = newValue;
            sortContainingGroup(activityInEditMode, state.activities, state.activitiesMap);
        }
    },
    validateEditedActivity(state) {
        const activityInEditMode = state.activityInEditMode;
        if (activityInEditMode && activityInEditMode.name.length > 1) {
            // start validating when length is more than 1

            const activities = state.activities;
            const activitiesMap = state.activitiesMap;
            const validationErrorCode = validationService.validateEditedActivity(activityInEditMode, activities, activitiesMap);
            if (validationErrorCode) {
                activityInEditMode.errorCode = validationErrorCode;
            } else {
                activityInEditMode.errorCode = undefined;
            }
        }
    },
    finishActivitiesLoading(state) {
        state.activitiesLoadingInProgress = false;
    },
    refreshCurrentExpandLevel(state) {
        let currentExpandLevel = 0;
        if (state.activities && state.activities.length && state.activities.length > 0) {
            for (const activity of state.activities) {
                const thisActivityExpandLevel = activitiesUtils.getExpandLevel(activity);
                if (thisActivityExpandLevel > currentExpandLevel) {
                    currentExpandLevel = thisActivityExpandLevel;
                    if (currentExpandLevel >= 3) {
                        // no reason to look for more, because 3 is a max of [0, 3]
                        break;
                    }
                }
            }
        }
        state.currentExpandLevel = currentExpandLevel;
    },
    enableDropZonesOnActivityMove(state, {activityId}) {
        return activitiesUtils.enableDropZonesOnActivityMove(state.activitiesMap, state.activities, activityId);
    },
    disableAllDropZonesOnActivityMoveEnd(state) {
        activitiesUtils.disableAllDropZonesOnActivityMoveEnd(state.activities)
    },
};

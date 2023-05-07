import activitiesUtils from "@/utils/activities-utils.js";

function uuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

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
    commitActivityCreation(state) {
        const activityCandidate = state.activitiesMap.get(activitiesUtils.activityCandidateId);
        if (activityCandidate) {
            activityCandidate.id = uuid();
            state.activitiesMap.delete(activitiesUtils.activityCandidateId);
            state.activitiesMap.set(activityCandidate.id, activityCandidate);
        }
    },
    refreshEditedActivityPosition(state, newValue) {
        const activityInEditMode = state.activityInEditMode;
        if (activityInEditMode) {
            activityInEditMode.name = newValue;
            sortContainingGroup(activityInEditMode, state.activities, state.activitiesMap);
        }
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
};

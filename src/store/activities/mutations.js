import activitiesService from "@/services/activities-service.js";

function uuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export default {
    refreshCurrentExpandLevel(state) {
        let currentExpandLevel = 0;
        if (state.activities && state.activities.length && state.activities.length > 0) {
            for (const activity of state.activities) {
                const thisActivityExpandLevel = activitiesService.getExpandLevel(activity);
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
    addActivity(state, activity) {
        let targetActivities = undefined;
        if (!activity.parent_activity_id) {
            targetActivities = state.activities;
        } else {
            const parentActivity = state.activitiesMap.get(activity.parent_activity_id);
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
            targetActivities.push(activity);
            state.activitiesMap.set(activity.id, activity);
            activitiesService.sort(targetActivities);
        }
    },
    removeActivity(state, activityId) {
        activitiesService.deleteById(activityId, state.activities);
        state.activitiesMap.delete(activityId);
    },
    commitActivityCreation(state) {
        const activityCandidate = state.activitiesMap.get(activitiesService.activityCandidateId);
        if (activityCandidate) {
            activityCandidate.id = uuid();
            state.activitiesMap.delete(activitiesService.activityCandidateId);
            state.activitiesMap.set(activityCandidate.id, activityCandidate);
        }
    },
    refreshActivityCandidatePosition(state, newValue) {
        const activityCandidate = state.activitiesMap.get(activitiesService.activityCandidateId);
        if (activityCandidate) {
            activityCandidate.name = newValue;
            let activities = undefined;
            if (!activityCandidate.parent_activity_id) {
                activities = state.activities;
            } else {
                activities = state.activitiesMap.get(activityCandidate.parent_activity_id).child_activities;
            }
            activitiesService.sort(activities);
        }
    },
};

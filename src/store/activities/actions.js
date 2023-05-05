import activitiesUtils from "@/utils/activities-utils";

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
    createActivityCandidate(context, payload) {
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
        const existingActivity = state.activitiesMap.get(activitiesUtils.activityCandidateId);
        const inTheSameGroup = existingActivity && existingActivity.parent_activity_id === parentActivityId;
        const inAnotherGroup = existingActivity && existingActivity.parent_activity_id !== parentActivityId;
        if (inTheSameGroup || inAnotherGroup) {
            context.commit('removeActivity', existingActivity.id);
        }
        if (!existingActivity || inAnotherGroup) {
            const newPotentialActivity = {
                id: activitiesUtils.activityCandidateId,
                parent_activity_id: parentActivityId,
                name: "",
                group,
            };
            if (parentActivity) {
                parentActivity.opened = true;
            }
            context.commit('addActivity', newPotentialActivity);
        }
    },
};
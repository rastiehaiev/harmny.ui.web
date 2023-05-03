import activitiesService from "@/services/activities-service";

export default {
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
        const existingActivity = state.activitiesMap.get(activitiesService.activityCandidateId);
        const inTheSameGroup = existingActivity && existingActivity.parent_activity_id === parentActivityId;
        const inAnotherGroup = existingActivity && existingActivity.parent_activity_id !== parentActivityId;
        if (inTheSameGroup || inAnotherGroup) {
            context.commit('removeActivity', existingActivity.id);
        }
        if (!existingActivity || inAnotherGroup) {
            const newPotentialActivity = {
                id: activitiesService.activityCandidateId,
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
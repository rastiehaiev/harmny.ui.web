function getExpandLevel(activity) {
    if (!activity.group || !activity.opened || !activity.child_activities || !activity.child_activities.length || activity.child_activities.length === 0) {
        return 0;
    }
    let maxChildActivityExpandLevel = 0;
    if (activity.child_activities && activity.child_activities.length && activity.child_activities.length > 0) {
        for (const childActivity of activity.child_activities) {
            const expandLevel = getExpandLevel(childActivity);
            if (expandLevel > maxChildActivityExpandLevel) {
                maxChildActivityExpandLevel = expandLevel;
            }
        }
    }
    return maxChildActivityExpandLevel + 1;
}

export default {
    refreshCurrentExpandLevel(state) {
        let currentExpandLevel = 0;
        if (state.activities && state.activities.length && state.activities.length > 0) {
            for (const activity of state.activities) {
                const thisActivityExpandLevel = getExpandLevel(activity);
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
        console.log(`Current expand level: ${state.currentExpandLevel}.`);
    },
};

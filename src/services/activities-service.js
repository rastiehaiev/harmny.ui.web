function populateActivitiesMap(activities, activitiesMap) {
    for (const activity of activities) {
        activitiesMap.set(activity.id, activity);
        let childActivities = activity.child_activities;
        if (childActivities && childActivities.length && childActivities.length > 0) {
            populateActivitiesMap(childActivities, activitiesMap);
        }
    }
}

export default {
    activityCandidateId: '00000000-0000-0000-0000-000000000000',
    toMap(activities) {
        const activitiesMap = new Map();
        populateActivitiesMap(activities, activitiesMap);
        return activitiesMap;
    },
    deleteById(activityId, activities) {
        for (let i = 0; i < activities.length; i++) {
            const activity = activities[i];
            if (activity.id === activityId) {
                console.log('Deleting activity ' + activityId);
                activities.splice(i, 1);
                return true;
            } else {
                const childActivities = activity.child_activities;
                if (childActivities && childActivities.length > 0) {
                    const isDeleted = this.deleteById(activityId, childActivities);
                    if (isDeleted) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    getExpandLevel(activity) {
        if (!activity.group || !activity.opened || !activity.child_activities || !activity.child_activities.length || activity.child_activities.length === 0) {
            return 0;
        }
        let maxChildActivityExpandLevel = 0;
        if (activity.child_activities && activity.child_activities.length && activity.child_activities.length > 0) {
            for (const childActivity of activity.child_activities) {
                const expandLevel = this.getExpandLevel(childActivity);
                if (expandLevel > maxChildActivityExpandLevel) {
                    maxChildActivityExpandLevel = expandLevel;
                }
            }
        }
        return maxChildActivityExpandLevel + 1;
    },
    isActivityCandidate(activityId) {
        return !activityId || activityId === this.activityCandidateId;
    },
    sort(activities) {
        activities.sort((a, b) => (+b.group) - (+a.group) || a.name.localeCompare(b.name));
    },
}

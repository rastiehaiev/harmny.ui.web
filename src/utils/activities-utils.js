function populateActivitiesMap(activities, activitiesMap) {
    if (activities) {
        for (const activity of activities) {
            activitiesMap.set(activity.id, activity);
            let childActivities = activity.child_activities;
            if (childActivities && childActivities.length && childActivities.length > 0) {
                populateActivitiesMap(childActivities, activitiesMap);
            }
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
    applyFromExisting(newActivities, currentActivitiesMap) {
        if (newActivities && currentActivitiesMap && currentActivitiesMap.size > 0) {
            for (const newActivity of newActivities) {
                const currentActivity = currentActivitiesMap.get(newActivity.id);
                if (currentActivity) {
                    newActivity.opened = currentActivity.opened;
                }
                const childActivities = newActivity.child_activities;
                if (childActivities && childActivities.length > 0) {
                    this.applyFromExisting(childActivities, currentActivitiesMap);
                }
            }
        }
    },
    deleteById(activityId, activities) {
        for (let i = 0; i < activities.length; i++) {
            const activity = activities[i];
            if (activity.id === activityId) {
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
    openAllInActivityHierarchy(activitiesMap, activityId) {
        if (activitiesMap && activityId) {
            const activity = activitiesMap.get(activityId);
            if (activity) {
                activity.opened = true;
                if (activity.parent_activity_id) {
                    this.openAllInActivityHierarchy(activitiesMap, activity.parent_activity_id);
                }
            }
        }
    },
    isActivityCandidate(activityId) {
        return !activityId || activityId === this.activityCandidateId;
    },
    sort(activities) {
        activities.sort((a, b) => (+b.group) - (+a.group) || a.name.localeCompare(b.name));
    },
}

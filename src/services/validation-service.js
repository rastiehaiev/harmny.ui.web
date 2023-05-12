const activityNameRegex = /^[\wа-щА-ЩЬьЮюЯяІіЇїЄєҐґ\s\-#_]+$/u;

function validateActivityName(activity) {
    if (activity) {
        if (activity.name.length < 2) {
            return 'fail.input.activity.name.invalid.too.short';
        }
        if (activity.name.length > 40) {
            return 'fail.input.activity.name.invalid.too.long';
        }
        if (!activityNameRegex.test(activity.name)) {
            return 'fail.input.activity.name.invalid.pattern.mismatch';
        }
    }
    return undefined;
}

function validateActivityExistsInGroup(activity, activities, activitiesMap) {
    let enclosingActivities = undefined;
    if (activity.parent_activity_id) {
        enclosingActivities = activitiesMap.get(activity.parent_activity_id)?.child_activities;
    } else {
        enclosingActivities = activities;
    }
    if (!enclosingActivities || enclosingActivities.length === 0) {
        return undefined;
    }
    const nameLowercase = activity.name.toLowerCase();
    for (const enclosingActivity of enclosingActivities) {
        if (enclosingActivity.name.toLowerCase() === nameLowercase && enclosingActivity.id !== activity.id) {
            return 'fail.input.activity.with.such.name.exists';
        }
    }
    return undefined;
}

export default {
    validateEditedActivity(activity, activities, activitiesMap) {
        const validators = [validateActivityName, validateActivityExistsInGroup];
        for (const validator of validators) {
            const errorCode = validator(activity, activities, activitiesMap);
            if (errorCode) {
                return errorCode;
            }
        }
        return undefined;
    },
}
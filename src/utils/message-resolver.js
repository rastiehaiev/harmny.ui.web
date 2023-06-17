const messagesMap = new Map();
messagesMap.set('fail.input.activity.with.such.name.exists', 'Activity with such name already exists');
messagesMap.set('fail.input.activity.name.invalid.too.short', 'Activity name is too short');
messagesMap.set('fail.input.activity.name.invalid.too.long', 'Activity name is too long');
messagesMap.set('fail.input.activity.name.invalid.pattern.mismatch', 'Activity name is invalid. Must contain only letters, digits and white spaces');

function defaultErrorMessage(code) {
    return `Unknown error occurred. Error code: '${code}'.`;
}

export default {
    resolveByCode(messageCode) {
        if (messageCode) {
            const resolvedValue = messagesMap.get(messageCode);
            if (resolvedValue) {
                return resolvedValue;
            }
        }
        return defaultErrorMessage(messageCode);
    },
};

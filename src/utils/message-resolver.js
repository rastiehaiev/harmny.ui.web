const messagesMap = new Map();
messagesMap.set('fail.input.activity.with.such.name.exists', 'Activity with such name already exists');
messagesMap.set('fail.input.activity.name.invalid.too.short', 'Activity name is too short');
messagesMap.set('fail.input.activity.name.invalid.too.long', 'Activity name is too long');
messagesMap.set('fail.input.activity.name.invalid.pattern.mismatch', 'Activity name is invalid. Must contain only letters, digits and white spaces');
messagesMap.set('fail.input.activity.dimension.exceeded', 'Max activities nesting exceeded');
messagesMap.set('fail.input.email.invalid', 'Email is invalid');
messagesMap.set('fail.input.password.too.short', 'Password is too short. Must be at least 8 characters long');
messagesMap.set('fail.input.password.too.long', 'Password is too long. Must be at most 100 characters long');
messagesMap.set('fail.input.password.invalid', 'Password is invalid. Must be at least 8 characters long. A digit and a letter must occur at least once. No whitespace allowed');
messagesMap.set('fail.authentication.user.not.found.by.credentials', 'User not found by specified credentials. Please check you spelling or consider signing in with one of our providers.');

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

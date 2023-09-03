export default {
    isMobileView(state) {
        return state.mobile;
    },
    getCurrentUser(state) {
        return state.currentUser;
    },
    lastActivityId(state) {
        return state.lastActivityId;
    },
};

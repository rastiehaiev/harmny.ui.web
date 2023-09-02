function isMobileView() {
    const sideBarElem = document.getElementById("app-sidebar");
    if (sideBarElem) {
        const borderTopStyle = getComputedStyle(sideBarElem).borderTopStyle;
        return borderTopStyle !== "none";
    }
    return false;
}

export default {
    updateMobile(state) {
        state.mobile = isMobileView();
    },
    updateLastActivityId(state, lastActivityId) {
        state.lastActivityId = lastActivityId;
    },
}
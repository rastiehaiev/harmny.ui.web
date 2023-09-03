function isMobileView() {
    if (window.innerWidth <= 600 && window.innerHeight <= 900) {
        return true;
    }

    const sideBarElem = document.getElementById("app-sidebar");
    if (sideBarElem) {
        const borderTopStyle = getComputedStyle(sideBarElem).borderTopStyle;
        return borderTopStyle !== "none";
    }
    return false;
}

import serviceUserClient from "@/clients/service-user-client";

export default {
    updateMobile(state) {
        state.mobile = isMobileView();
    },
    updateLastActivityId(state, lastActivityId) {
        state.lastActivityId = lastActivityId;
    },
    fetchCurrentUser(state) {
        if (localStorage.getItem('token')) {
            serviceUserClient.get("/users/me").then(response => {
                state.currentUser = response.data;
            }).catch(error => {
                console.log('Failed to fetch user.');
                console.log(error);
            });
        }
    },
};
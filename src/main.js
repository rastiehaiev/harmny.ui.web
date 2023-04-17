import {createApp} from 'vue'
import App from './App.vue'

import router from "@/router/router.js";
import store from "@/store/index.js";

import "./assets/base.css";

import AppSideBar from "@/components/basic/AppSideBar.vue";
import AppBreadCrumbs from "@/components/basic/AppBreadCrumbs.vue";
import ViewActivities from "@/components/views/ViewActivities.vue";

import IconActivitiesActivity from "@/components/basic/icons/IconActivitiesActivity.vue";
import IconActivitiesActivityGroupEmpty from "@/components/basic/icons/IconActivitiesActivityGroupEmpty.vue";
import IconActivitiesActivityGroupClosed from "@/components/basic/icons/IconActivitiesActivityGroupClosed.vue";
import IconActivitiesActivityGroupOpen from "@/components/basic/icons/IconActivitiesActivityGroupOpen.vue";

import IconMoreDots from "@/components/basic/icons/IconMoreDots.vue";
import IconLogo from "@/components/basic/icons/IconLogo.vue";

import IconSideBarActivities from "@/components/basic/icons/IconSideBarActivities.vue";
import IconSideBarGoals from "@/components/basic/icons/IconSideBarGoals.vue";

import IconSideBarRoutines from "@/components/basic/icons/IconSideBarRoutines.vue";
import IconActivitiesActionItemsNewFolder from "@/components/basic/icons/IconActivitiesActionItemsNewFolder.vue";
import IconActivitiesActionItemsCollapse from "@/components/basic/icons/IconActivitiesActionItemsCollapse.vue";
import IconActivitiesActionItemsCollapseVertical
    from "@/components/basic/icons/IconActivitiesActionItemsCollapseVertical.vue";
import IconActivitiesActionItemsExpandVertical
    from "@/components/basic/icons/IconActivitiesActionItemsExpandVertical.vue";

const app = createApp(App)
app.use(router);
app.use(store);

app.component('view-activity', ViewActivities);

app.component('app-side-bar', AppSideBar);
app.component('app-bread-crumbs', AppBreadCrumbs);

app.component('icon-activities-activity', IconActivitiesActivity);
app.component('icon-activities-activity-group-empty', IconActivitiesActivityGroupEmpty);
app.component('icon-activities-activity-group-closed', IconActivitiesActivityGroupClosed);
app.component('icon-activities-activity-group-open', IconActivitiesActivityGroupOpen);
app.component('icon-logo', IconLogo);
app.component('icon-more-dots', IconMoreDots);

app.component('icon-side-bar-activity', IconSideBarActivities);
app.component('icon-side-bar-goals', IconSideBarGoals);
app.component('icon-side-bar-routines', IconSideBarRoutines);

app.component('icon-activities-action-items-new-folder', IconActivitiesActionItemsNewFolder);
app.component('icon-activities-action-items-collapse', IconActivitiesActionItemsCollapse);
app.component('icon-activities-action-items-collapse-vertical', IconActivitiesActionItemsCollapseVertical);
app.component('icon-activities-action-items-expand-vertical', IconActivitiesActionItemsExpandVertical);

app.mount('#app')

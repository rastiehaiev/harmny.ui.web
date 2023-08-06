import {createApp} from 'vue'
import App from './App.vue'

import WaveUI from "wave-ui";
import router from "@/router/router.js";
import store from "@/store/index.js";

import apiClient from "@/clients/api-client.js";
import serviceUserClient from "@/clients/service-user-client.js";
import clientInterceptor from "@/clients/client-interceptor.js";

import "./assets/base.css";
import 'wave-ui/dist/wave-ui.css'
import '@mdi/font/css/materialdesignicons.min.css'

import AppSideBar from "@/components/basic/AppSideBar.vue";
import AppBreadCrumbs from "@/components/basic/AppBreadCrumbs.vue";
import ViewActivities from "@/components/views/ViewActivities.vue";

import IconLogo from "@/components/basic/icons/IconLogo.vue";

const app = createApp(App)
app.use(router);
app.use(store);
app.use(WaveUI);

app.component('icon-logo', IconLogo);

app.component('app-side-bar', AppSideBar);
app.component('app-bread-crumbs', AppBreadCrumbs);

app.component('view-activity', ViewActivities);

clientInterceptor(apiClient, serviceUserClient);
clientInterceptor(serviceUserClient, serviceUserClient);

app.mount('#app')

import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

import WaveUI from 'wave-ui'
import router from '@/router/router'
import store from '@/store/index'

import apiClient from '@/clients/api-client'
import serviceUserClient from '@/clients/service-user-client'
import clientInterceptor from '@/clients/client-interceptor'

import './assets/primevue-theme.css'
import './assets/base.css'
import 'primeicons/primeicons.css'
import 'wave-ui/dist/wave-ui.css'
import '@mdi/font/css/materialdesignicons.min.css'

import AppSideBar from '@/components/basic/AppSideBar.vue'
import AppBreadCrumbs from '@/components/basic/AppBreadCrumbs.vue'
import ViewActivities from '@/components/views/ViewActivities.vue'

import IconLogo from '@/components/basic/icons/IconLogo.vue'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(WaveUI)
app.use(PrimeVue)
app.use(ToastService)

app.component('icon-logo', IconLogo)

app.component('app-side-bar', AppSideBar)
app.component('app-bread-crumbs', AppBreadCrumbs)

app.component('view-activity', ViewActivities)

clientInterceptor(apiClient, serviceUserClient)
clientInterceptor(serviceUserClient, serviceUserClient)

app.component(
  'activity-view',
  defineAsyncComponent(() => import('@/components/activity/ActivityDetailsArea.vue')),
)

app.mount('#app')

<template>
  <Toast />
  <router-view></router-view>
</template>

<script>
import eventBus from '@/common/event-bus.js'
import appStorage from '@/utils/app-storage'
import Toast from 'primevue/toast'

export default {
  components: { Toast },
  methods: {
    onResize() {
      this.$store.commit('updateMobile')
    },
  },
  computed: {
    isMobileView() {
      return this.$store.getters.mobile
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
    eventBus.on('sign-out', () => {
      appStorage.removeToken()
      appStorage.removeRefreshToken()
      this.$router.push('/sign-in')
    })
    eventBus.on('token-set', () => {
      this.$store.commit('fetchCurrentUser')
    })
    if (appStorage.getToken()) {
      this.$store.commit('fetchCurrentUser')
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize)
    eventBus.remove('sign-out')
    eventBus.remove('token-set')
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@250;300;350;400;500&display=swap');

html {
  color: var(--color-gray-4);
  font-weight: 300;
  font-family: Inter, Helvetica, monospace;
  overflow: hidden;
}

.app-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 3.6rem;
  padding-bottom: 4rem;
  position: fixed;
  width: 100%;
}

@media only screen and (min-width: 50rem) {
  .app-content {
    height: 100%;
    padding-left: 4rem;
    padding-bottom: 0;
  }
}
</style>
<script setup></script>

<template>
  <aside id="app-sidebar">
    <nav class="app-sidebar__nav">
      <ul class="app-sidebar__items">
        <li
          :class="{
            'app-sidebar__item': mobile,
            'app-sidebar__item--logo': !mobile,
            'app-sidebar__item--active': this.currentPath === '',
          }"
        >
          <router-link to="/" title="Home">
            <w-icon v-if="mobile">mdi mdi-home-outline</w-icon>
            <icon-logo v-else />
          </router-link>
        </li>
        <li
          class="app-sidebar__item"
          :class="{ 'app-sidebar__item--active': this.currentPath === 'activities' }"
        >
          <router-link to="/activities" title="Activities">
            <w-icon>mdi mdi-run</w-icon>
          </router-link>
        </li>
        <li
          class="app-sidebar__item"
          :class="{ 'app-sidebar__item--active': this.currentPath === 'routines' }"
        >
          <router-link to="/routines" title="Routines">
            <w-icon>mdi mdi-list-box-outline</w-icon>
          </router-link>
        </li>
        <li
          class="app-sidebar__item"
          :class="{ 'app-sidebar__item--active': this.currentPath === 'goals' }"
        >
          <router-link to="/goals" title="Goals">
            <w-icon>mdi mdi-bullseye</w-icon>
          </router-link>
        </li>
      </ul>
      <img
        v-if="!!userProfileUrl"
        :src="userProfileUrl"
        @click.prevent="signOut"
        class="app-sidebar__link-profile"
        alt="Profile image"
        referrerpolicy="no-referrer"
      />
      <a v-else href="#" @click.prevent="signOut" class="app-sidebar__link-profile"></a>
    </nav>
  </aside>
</template>

<style scoped>
#app-sidebar {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: var(--sidebar-width);
  border-top: 1px solid #eaeaea;
  justify-content: center;
  z-index: 70;
  background-color: white;
}

.app-sidebar__nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  justify-content: center;
  gap: 2rem;
}

.app-sidebar__items {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2.4rem;
}

@media only screen and (min-width: 50rem) {
  #app-sidebar {
    width: var(--sidebar-width);
    height: 100%;
    border-right: 1px solid #eaeaea;
    border-top: none;
    box-shadow: 4px 0 5px -2px #eaeaea;
    padding: 1.2rem 0 1.6rem 0;
  }

  .app-sidebar__nav {
    flex-direction: column;
    justify-content: space-between;
  }

  .app-sidebar__items {
    flex-direction: column;
  }
}

.app-sidebar__item--logo a,
.app-sidebar__item a {
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-sidebar__item--logo svg {
  height: 2.5rem;
  width: 2.5rem;
}

.app-sidebar__item i {
  font-size: 1.8rem;
}

.app-sidebar__item i {
  color: var(--color-gray-2);
}

.app-sidebar__item i:hover,
.app-sidebar__item i:active {
  color: var(--color-gray-3);
}

.app-sidebar__item--active i,
.app-sidebar__item--active:hover i,
.app-sidebar__item--active:active i {
  color: var(--color-magenta-1);
}

.app-sidebar__link-profile {
  cursor: pointer;
  width: 1.8rem;
  height: 1.8rem;
  background-size: 1.8rem 1.8rem;
  background-position: center;
  border-radius: 1.8rem;
  border: 1px solid #909090;
}

@media only screen and (min-width: 50rem) {
  .app-sidebar__link-profile {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 2.4rem;
  }
}
</style>
<script>
import eventBus from '@/common/event-bus'

export default {
  data() {
    return {
      userProfileUrl: undefined,
    }
  },
  methods: {
    signOut() {
      eventBus.dispatch('sign-out')
    },
    updateUserProfileUrl() {
      const currentUser = this.$store.getters['getCurrentUser']
      if (currentUser) {
        const { profile_photo_url: profilePhotoUrl } = currentUser
        if (profilePhotoUrl) {
          this.userProfileUrl = profilePhotoUrl
        }
      }
    },
  },
  computed: {
    mobile() {
      return this.$store.getters['isMobileView']
    },
    currentPath() {
      return this.$route.path.split('/')[1]
    },
  },
  watch: {
    '$store.state.currentUser'() {
      this.updateUserProfileUrl()
    },
  },
  mounted() {
    this.updateUserProfileUrl()
    this.$store.commit('updateMobile')
    this.$nextTick(() => {
      this.$store.commit('updateMobile')
    })
  },
}
</script>

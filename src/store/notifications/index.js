import mutations from '@/store/notifications/mutations.js'
import getters from '@/store/notifications/getters.js'

export default {
  namespaced: true,
  state() {
    return {
      activityToBeDeleted: undefined,
    }
  },
  mutations,
  getters,
}

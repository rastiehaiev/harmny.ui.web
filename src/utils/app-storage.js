import eventBus from '@/common/event-bus'

const TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refresh-token'

export default {
  setToken(value) {
    this.set(TOKEN_KEY, value)
  },
  setRefreshToken(value) {
    this.set(REFRESH_TOKEN_KEY, value)
  },
  set(key, value) {
    localStorage.setItem(key, value)
    if (key === TOKEN_KEY && value) {
      eventBus.dispatch('token-set')
    }
  },
  get(key) {
    return localStorage.getItem(key)
  },
  getToken() {
    return this.get(TOKEN_KEY)
  },
  getRefreshToken() {
    return this.get(REFRESH_TOKEN_KEY)
  },
  remove(key) {
    localStorage.removeItem(key)
  },
  removeToken() {
    this.remove(TOKEN_KEY)
  },
  removeRefreshToken() {
    this.remove(REFRESH_TOKEN_KEY)
  },
}

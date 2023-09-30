import axios from 'axios'
import configProvider from '@/utils/config-provider.js'

const { serviceUserBaseUrl } = configProvider

const instance = axios.create({
  baseURL: serviceUserBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default instance

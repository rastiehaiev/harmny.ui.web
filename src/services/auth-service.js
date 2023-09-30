import serviceUserClient from '@/clients/service-user-client'

export default {
  async signin(email, password) {
    return await serviceUserClient.post('/auth/sign-in', { email, password }).then((response) => {
      return response.data
    })
  },
}

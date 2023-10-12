import apiClient from '@/clients/api-client.js'

export default {
  async listAll() {
    return await apiClient.get('/').then((response) => {
      return response.data
    })
  },
  async create(activity) {
    const { name, group, parent_activity_id } = activity
    const newActivity = {
      name,
      group,
      parent_activity_id,
    }
    return await apiClient.post('/', newActivity).then((response) => {
      return response.data
    })
  },
  async rename(activityId, name) {
    return await apiClient.put(`/${activityId}`, { name }).then((response) => {
      return response.data
    })
  },
  async move(activity, parentActivityId) {
    const normalisedParentActivityId = parentActivityId ? parentActivityId : 'root'
    return await apiClient
      .put(`/${activity.id}`, { parent_activity_id: normalisedParentActivityId })
      .then((response) => {
        return response.data
      })
  },
  async delete(activityId) {
    return await apiClient.delete(`/${activityId}`).then((response) => {
      return response.data
    })
  },
  async getRepetition(activityId, repetitionId) {
    return await apiClient.get(`/${activityId}/repetitions/${repetitionId}`).then((response) => {
      return response.data
    })
  },
  async startRepetition(activityId, repetitionId, repetition) {
    return await apiClient
      .post(`/${activityId}/repetitions/${repetitionId}/start`, repetition)
      .then((response) => {
        return response.data
      })
  },
  async pauseRepetition(activityId, repetitionId) {
    return await apiClient
      .post(`/${activityId}/repetitions/${repetitionId}/pause`)
      .then((response) => {
        return response.data
      })
  },
  async deleteRepetition(activityId, repetitionId) {
    return await apiClient.delete(`/${activityId}/repetitions/${repetitionId}`).then((response) => {
      return response.data
    })
  },
  async upsertRepetition(activityId, repetitionId, repetition) {
    if (repetitionId) {
      return await apiClient
        .put(`/${activityId}/repetitions/${repetitionId}`, repetition)
        .then((response) => {
          return response.data
        })
    }
    return await apiClient.post(`/${activityId}/repetitions`, repetition).then((response) => {
      return response.data
    })
  },
}

import apiClient from "@/clients/api-client.js";

export default {
    async listAll() {
        return apiClient.get('/').then(response => {
            return response.data;
        });
    },
    async create(activity) {
        const {name, group, parent_activity_id} = activity;
        const newActivity = {
            name,
            group,
            parent_activity_id,
        }

        return apiClient.post('/', newActivity).then(response => {
            return response.data;
        });
    },
    async rename(activityId, name) {
        return apiClient.put(`/${activityId}`, {name}).then(response => {
            return response.data;
        });
    },
    async move(activity, parentActivityId) {
        const normalisedParentActivityId = parentActivityId ? parentActivityId : "root";
        return apiClient.put(`/${activity.id}`, {parent_activity_id: normalisedParentActivityId}).then(response => {
            return response.data;
        });
    },
    async delete(activityId) {
        return apiClient.delete(`/${activityId}`).then(response => {
            return response.data;
        });
    },
};

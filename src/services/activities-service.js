import axios from 'axios';
import configProvider from "@/utils/config-provider.js";

const {apiToken, apiActivitiesUrl} = configProvider;

function apiActivityUrl(activityId) {
    if (!activityId) {
        throw Error("No activity ID provided.");
    }
    return `${apiActivitiesUrl}/${activityId}`;
}

export default {
    async listAll() {
        return axios.get(apiActivitiesUrl, {
            headers: {
                Authorization: `Bearer ${apiToken}`,
            },
        }).then(response => {
            return response.data;
        });
    },
    async create(activity) {
        const {id, ...activityObject} = activity;
        if (id) {
            // just to skip the "Unused variable" warning
            const newActivity = {...activityObject};
            return axios.post(apiActivitiesUrl, {...newActivity}, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            }).then(response => {
                return response.data;
            });
        }
    },
    async rename(activityId, name) {
        return axios.put(apiActivityUrl(activityId), {name}, {
            headers: {
                Authorization: `Bearer ${apiToken}`,
            },
        }).then(response => {
            return response.data;
        });
    },
    async delete(activityId) {
        return axios.delete(apiActivityUrl(activityId), {
            headers: {
                Authorization: `Bearer ${apiToken}`,
            },
        }).then(response => {
            return response.data;
        });
    },
};

import axios from 'axios';
import configProvider from "@/utils/config-provider.js";

const token = configProvider.apiToken;
const apiActivitiesUrl = `${configProvider.apiBaseUrl}/activities`;

export default {
    async listAll() {
        return axios.get(apiActivitiesUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(response => {
            return {data: response.data}
        });
    },
};

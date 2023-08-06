import axios from "axios";
import configProvider from "@/utils/config-provider.js";

const {apiBaseUrl} = configProvider;
const apiActivitiesUrl = `${apiBaseUrl}/activities`;

const instance = axios.create({
    baseURL: apiActivitiesUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

export default instance;

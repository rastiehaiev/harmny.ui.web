import eventBus from "@/common/event-bus";
import appStorage from "@/utils/app-storage";

const setup = (client, serviceUserClient) => {
    client.interceptors.request.use(
        (config) => {
            const token = appStorage.getToken();
            if (token) {
                config.headers["Authorization"] = "Bearer " + token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    client.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err) => {
            const originalConfig = err.config;
            if (originalConfig.url !== "/auth/sign-in" && originalConfig.url !== "/auth/refresh-token" && err.response) {
                // access token expired
                const status = err.response.status;
                if (status === 401 && !originalConfig._retry) {
                    try {
                        const currentRefreshToken = appStorage.getRefreshToken();
                        if (currentRefreshToken) {
                            const refreshTokenResponse = await serviceUserClient.post("/auth/refresh-token", {
                                token: currentRefreshToken
                            });
                            const { token, refresh_token: refreshToken } = refreshTokenResponse.data;
                            if (token && refreshToken) {
                                originalConfig._retry = true;
                                appStorage.setToken(token);
                                appStorage.setRefreshToken(refreshToken);
                                return client(originalConfig);
                            }
                            eventBus.dispatch("sign-out");
                        }
                    } catch (_error) {
                        eventBus.dispatch("sign-out");
                        return Promise.reject(_error);
                    }
                }
            }
            return Promise.reject(err);
        }
    );
};

export default setup;

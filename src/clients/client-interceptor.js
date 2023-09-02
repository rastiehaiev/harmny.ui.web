import eventBus from "@/common/event-bus";

const setup = (client, serviceUserClient) => {
    client.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("token");
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
                        const currentRefreshToken = localStorage.getItem("refresh-token");
                        if (currentRefreshToken) {
                            const refreshTokenResponse = await serviceUserClient.post("/auth/refresh-token", {
                                token: currentRefreshToken
                            });
                            const { token, refresh_token: refreshToken } = refreshTokenResponse.data;
                            if (token && refreshToken) {
                                originalConfig._retry = true;
                                localStorage.setItem("token", token);
                                localStorage.setItem("refresh-token", refreshToken);
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

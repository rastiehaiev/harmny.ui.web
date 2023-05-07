export default {
    apiToken: import.meta.env.VITE_HARMNY_API_TOKEN,
    apiBaseUrl: import.meta.env.VITE_HARMNY_API_BASE_URL,
    apiActivitiesUrl: `${import.meta.env.VITE_HARMNY_API_BASE_URL}/activities`,
    uiBaseUrl: import.meta.env.VITE_HARMNY_UI_BASE_URL,
    uiActivitiesUrl: `${import.meta.env.VITE_HARMNY_UI_BASE_URL}/activities`,
}

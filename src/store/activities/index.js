import mutations from '@/store/activities/mutations.js';
import getters from '@/store/activities/getters.js';
import actions from '@/store/activities/actions.js';

const activitiesArray = [
    {
        id: "b3bc2313-d8a3-451f-9947-2bcd120ea585",
        name: "Health",
        group: true,
        created_at: "2023-02-24T10:01:08.827256Z",
        last_updated_at: "2023-02-24T10:01:08.827256Z",
        child_activities: [
            {
                id: "3cbea44a-8e87-4532-9b80-7eeaeac21e1b",
                name: "Abs",
                group: true,
                parent_activity_id: "b3bc2313-d8a3-451f-9947-2bcd120ea585",
                created_at: "2023-02-24T10:04:24.155277Z",
                last_updated_at: "2023-02-24T10:04:24.155277Z",
                child_activities: [
                    {
                        id: "cc6fd1ad-c4e6-499e-a608-c43c1c25d51d",
                        name: "Alternating Crunch",
                        group: false,
                        parent_activity_id: "3cbea44a-8e87-4532-9b80-7eeaeac21e1b",
                        created_at: "2023-02-24T10:05:11.331912Z",
                        last_updated_at: "2023-02-24T10:05:11.331912Z"
                    },
                    {
                        id: "7fc551a2-8a2d-4961-903f-f37b58522354",
                        name: "Leg Elevation",
                        group: false,
                        parent_activity_id: "3cbea44a-8e87-4532-9b80-7eeaeac21e1b",
                        created_at: "2023-02-24T10:05:34.067322Z",
                        last_updated_at: "2023-02-24T10:05:34.067322Z"
                    },
                    {
                        id: "19997075-8725-442a-8e24-e64d2502b291",
                        name: "Leg Push",
                        group: false,
                        parent_activity_id: "3cbea44a-8e87-4532-9b80-7eeaeac21e1b",
                        created_at: "2023-02-24T10:05:17.931163Z",
                        last_updated_at: "2023-02-24T10:05:17.931163Z"
                    }
                ]
            },
            {
                id: "5daab5b6-69e7-4446-a6b0-d170eea343ff",
                name: "Glutes",
                group: true,
                parent_activity_id: "b3bc2313-d8a3-451f-9947-2bcd120ea585",
                created_at: "2023-02-24T10:04:24.155277Z",
                last_updated_at: "2023-02-24T10:04:24.155277Z",
                child_activities: [
                    {
                        id: "c885f3bd-d1b5-4578-a501-87268bf5d3ed",
                        name: "Exercise #1",
                        group: false,
                        parent_activity_id: "5daab5b6-69e7-4446-a6b0-d170eea343ff",
                        created_at: "2023-02-24T10:05:11.331912Z",
                        last_updated_at: "2023-02-24T10:05:11.331912Z"
                    },
                    {
                        id: "1d41074d-11d2-41ad-a9e9-997d53979a13",
                        name: "Exercise #2",
                        group: false,
                        parent_activity_id: "5daab5b6-69e7-4446-a6b0-d170eea343ff",
                        created_at: "2023-02-24T10:05:34.067322Z",
                        last_updated_at: "2023-02-24T10:05:34.067322Z"
                    },
                    {
                        id: "abf955ff-e975-4d25-adfa-af56897295c9",
                        name: "Exercise #3",
                        group: false,
                        parent_activity_id: "5daab5b6-69e7-4446-a6b0-d170eea343ff",
                        created_at: "2023-02-24T10:05:17.931163Z",
                        last_updated_at: "2023-02-24T10:05:17.931163Z"
                    },
                    {
                        id: "a7607700-71a6-4e4e-b5f1-3c96eb4dd1bd",
                        name: "Exercise #4",
                        group: false,
                        parent_activity_id: "5daab5b6-69e7-4446-a6b0-d170eea343ff",
                        created_at: "2023-02-24T10:05:17.931163Z",
                        last_updated_at: "2023-02-24T10:05:17.931163Z"
                    },
                    {
                        id: "18a3590e-d0e9-4745-9f27-a8c204fd059f",
                        name: "Exercise #5",
                        group: false,
                        parent_activity_id: "5daab5b6-69e7-4446-a6b0-d170eea343ff",
                        created_at: "2023-02-24T10:05:17.931163Z",
                        last_updated_at: "2023-02-24T10:05:17.931163Z"
                    }
                ]
            },
            {
                id: "034e8acf-bf88-47c8-b178-76b8adabe6ac",
                name: "Pull-Ups",
                group: false,
                parent_activity_id: "b3bc2313-d8a3-451f-9947-2bcd120ea585",
                created_at: "2023-02-24T10:01:45.991535Z",
                last_updated_at: "2023-02-24T10:01:45.991535Z"
            },
            {
                id: "a8dbe573-0a1e-435c-b93e-cf3d97e9212e",
                name: "Push-Ups",
                group: false,
                parent_activity_id: "b3bc2313-d8a3-451f-9947-2bcd120ea585",
                created_at: "2023-02-24T10:01:41.524752Z",
                last_updated_at: "2023-02-24T10:01:41.524752Z"
            }
        ]
    },
    {
        id: "62895b95-0cb1-4b52-b5a2-40ff75343d96",
        name: "Music",
        group: true,
        created_at: "2023-02-24T10:01:13.025891Z",
        last_updated_at: "2023-02-24T10:01:13.025891Z",
        child_activities: [
            {
                id: "64f9b66a-8c3c-44cd-b7a6-31f995de61fb",
                name: "Ear Training",
                group: true,
                parent_activity_id: "62895b95-0cb1-4b52-b5a2-40ff75343d96",
                created_at: "2023-02-24T10:05:54.884357Z",
                last_updated_at: "2023-02-24T10:05:54.884357Z"
            },
            {
                id: "e704913c-e2f8-4d92-915a-b481f18e22fb",
                name: "Technique Lessons",
                group: true,
                parent_activity_id: "62895b95-0cb1-4b52-b5a2-40ff75343d96",
                created_at: "2023-02-24T10:06:15.797877Z",
                last_updated_at: "2023-02-24T10:06:15.797877Z",
                child_activities: [
                    {
                        id: "e704914c-e2f8-4d92-915a-b481f18e22fa",
                        name: "Gammas",
                        group: true,
                        parent_activity_id: "e704913c-e2f8-4d92-915a-b481f18e22fb",
                        created_at: "2023-02-24T10:06:15.797877Z",
                        last_updated_at: "2023-02-24T10:06:15.797877Z",
                        child_activities: [
                            {
                                id: "e705913c-e2f8-4d92-915a-b481f18e22fc",
                                name: "C major",
                                group: false,
                                parent_activity_id: "e704914c-e2f8-4d92-915a-b481f18e22fa",
                                created_at: "2023-02-24T10:06:15.797877Z",
                                last_updated_at: "2023-02-24T10:06:15.797877Z"
                            },
                            {
                                id: "e705913c-e2f8-4d92-915a-b481f18e22fd",
                                name: "C minor",
                                group: false,
                                parent_activity_id: "e704914c-e2f8-4d92-915a-b481f18e22fa",
                                created_at: "2023-02-24T10:06:15.797877Z",
                                last_updated_at: "2023-02-24T10:06:15.797877Z"
                            },
                            {
                                id: "e705913c-e2f8-4d92-915a-b481f18e22fe",
                                name: "C# major",
                                group: false,
                                parent_activity_id: "e704914c-e2f8-4d92-915a-b481f18e22fa",
                                created_at: "2023-02-24T10:06:15.797877Z",
                                last_updated_at: "2023-02-24T10:06:15.797877Z"
                            }
                        ]
                    },
                    {
                        id: "e704913c-e2f8-4d92-915a-b481f18e22fa",
                        name: "Gannon",
                        group: true,
                        parent_activity_id: "e704913c-e2f8-4d92-915a-b481f18e22fb",
                        created_at: "2023-02-24T10:06:15.797877Z",
                        last_updated_at: "2023-02-24T10:06:15.797877Z",
                        child_activities: [
                            {
                                id: "e704913c-e2f8-4d92-915a-b481f18e22fc",
                                name: "Gannon #1",
                                group: false,
                                parent_activity_id: "e704913c-e2f8-4d92-915a-b481f18e22fa",
                                created_at: "2023-02-24T10:06:15.797877Z",
                                last_updated_at: "2023-02-24T10:06:15.797877Z"
                            },
                            {
                                id: "e704913c-e2f8-4d92-915a-b481f18e22fd",
                                name: "Gannon #2",
                                group: false,
                                parent_activity_id: "e704913c-e2f8-4d92-915a-b481f18e22fa",
                                created_at: "2023-02-24T10:06:15.797877Z",
                                last_updated_at: "2023-02-24T10:06:15.797877Z"
                            },
                            {
                                id: "e704913c-e2f8-4d92-915a-b481f18e22fe",
                                name: "Gannon #3 (very very very loooooong name, like really, I'm not kidding)",
                                group: false,
                                parent_activity_id: "e704913c-e2f8-4d92-915a-b481f18e22fa",
                                created_at: "2023-02-24T10:06:15.797877Z",
                                last_updated_at: "2023-02-24T10:06:15.797877Z"
                            },
                            {
                                id: "8ac7cde3-287e-47e4-9137-811fa90ed9d7",
                                name: "Gannon #4",
                                group: false,
                                parent_activity_id: "e704913c-e2f8-4d92-915a-b481f18e22fa",
                                created_at: "2023-02-24T10:06:15.797877Z",
                                last_updated_at: "2023-02-24T10:06:15.797877Z"
                            },
                            {
                                id: "abd534bc-661b-4b31-9f7c-b24a23621619",
                                name: "Gannon #5",
                                group: false,
                                parent_activity_id: "e704913c-e2f8-4d92-915a-b481f18e22fa",
                                created_at: "2023-02-24T10:06:15.797877Z",
                                last_updated_at: "2023-02-24T10:06:15.797877Z"
                            },
                            {
                                id: "fcaf86b8-758e-4292-8efd-061544181453",
                                name: "Gannon #6",
                                group: false,
                                parent_activity_id: "e704913c-e2f8-4d92-915a-b481f18e22fa",
                                created_at: "2023-02-24T10:06:15.797877Z",
                                last_updated_at: "2023-02-24T10:06:15.797877Z"
                            },
                            {
                                id: "4cb103fd-9394-4ffe-9a53-608b47165179",
                                name: "Gannon #7",
                                group: false,
                                parent_activity_id: "e704913c-e2f8-4d92-915a-b481f18e22fa",
                                created_at: "2023-02-24T10:06:15.797877Z",
                                last_updated_at: "2023-02-24T10:06:15.797877Z"
                            },
                            {
                                id: "7d7eeba0-3aa3-40cf-ac0e-dc2a58b41d31",
                                name: "Gannon #8",
                                group: false,
                                parent_activity_id: "e704913c-e2f8-4d92-915a-b481f18e22fa",
                                created_at: "2023-02-24T10:06:15.797877Z",
                                last_updated_at: "2023-02-24T10:06:15.797877Z"
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

const activitiesMap = new Map()

function populateActivitiesMap(activities) {
    for (const activity of activities) {
        activitiesMap.set(activity.id, activity);
        let childActivities = activity.child_activities;
        if (childActivities && childActivities.length && childActivities.length > 0) {
            populateActivitiesMap(childActivities)
        }
    }
}

populateActivitiesMap(activitiesArray);

export default {
    namespaced: true,
    state() {
        return {
            activities: activitiesArray,
            activitiesMap,
            currentExpandLevel: 0,
        }
    },
    mutations,
    getters,
    actions,
};

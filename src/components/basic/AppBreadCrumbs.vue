<template>
    <header class="app-bread-crumbs">
        <div class="app-bread-crumbs__content">
            <template v-for="(item, index) in linksChain">
                <router-link v-if="index !== linksChain.length - 1" class="app-bread-crumbs__item" :to=item.link :key="item.link">
                    {{ item.name }}
                </router-link>
                <span v-if="index !== linksChain.length - 1" class="app-bread-crumbs__item" :key="item.link">/</span>
                <div v-if="index === linksChain.length - 1" class="app-bread-crumbs__item" :key="item.link">
                    <span class="app-bread-crumbs__item">{{ item.name }}</span>
                </div>
            </template>
        </div>
    </header>
</template>

<script>
const defaultActivitiesChain = [
    {
        name: "Activities",
        link: "/activities",
    }
]

function generateActivitiesChain(activitiesMap, activityId, prependBaseLink = true) {
    let chain = [];
    const activity = activitiesMap.get(activityId);
    if (activity) {
        chain.push({
            name: activity.name,
            link: `/activities/${activity.id}`,
        });
        if (activity.parent_activity_id) {
            const parentChain = generateActivitiesChain(activitiesMap, activity.parent_activity_id, false);
            chain = parentChain.concat(chain);
        }
    }

    if (prependBaseLink) {
        chain = defaultActivitiesChain.concat(chain);
    }
    return chain;
}

export default {
    data() {
        return {
            linksChain: defaultActivitiesChain,
        }
    },
    computed: {
        activitiesMap() {
            return this.$store.getters['activities/activitiesMap'];
        }
    },
    methods: {
        updateBreadCrumbs() {
            const currentPath = this.$route.path;
            if (currentPath) {
                if (currentPath.startsWith('/activities')) {
                    const activityId = this.$route.params.activityId;
                    if (activityId) {
                        this.linksChain = generateActivitiesChain(this.activitiesMap, activityId);
                    } else {
                        this.linksChain = defaultActivitiesChain;
                    }
                } else if (currentPath.startsWith('/routines')) {
                    this.linksChain = [
                        {
                            name: "Routines",
                            link: "/routines",
                        }
                    ]
                } else if (currentPath.startsWith('/goals')) {
                    this.linksChain = [
                        {
                            name: "Goals",
                            link: "/goals",
                        }
                    ]
                }
            }
        }
    },
    watch: {
        $route() {
            this.updateBreadCrumbs();
        }
    },
}
</script>

<style scoped>

.app-bread-crumbs {
    background-color: white;
    display: block;
    position: fixed;
    height: 3.6rem;
    width: 100%;
    border-bottom: 1px solid #EAEAEA;
    box-sizing: border-box;
}

.app-bread-crumbs__content {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0 1.2rem;
    box-sizing: border-box;
}

.app-bread-crumbs__item:not(:last-child) {
    display: none;
}

.app-bread-crumbs__item {
    text-align: center;
}

span.app-bread-crumbs__item {
    color: #444343;
    font-size: 1rem;
}

@media only screen and (min-width: 50rem) {
    .app-bread-crumbs {
        margin-left: 4rem;
    }

    .app-bread-crumbs__content {
        justify-content: flex-start;
    }

    .app-bread-crumbs__item:not(:last-child) {
        display: block;
    }

    .app-bread-crumbs__item {
        text-align: left;
    }

    a.app-bread-crumbs__item {
        color: #147c98;
        text-decoration: none;
        font-weight: 300;
    }

    a.app-bread-crumbs__item:hover {
        color: #279b91;
    }
}

</style>

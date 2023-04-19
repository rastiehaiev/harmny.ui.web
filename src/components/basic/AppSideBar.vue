<template>
    <aside id="app-sidebar">
        <nav class="app-sidebar__nav">
            <ul class="app-sidebar__items">
                <li class="app-sidebar__item--logo">
                    <router-link to="/" title="Home">
                        <icon-logo/>
                    </router-link>
                </li>
                <li class="app-sidebar__item app-sidebar__item--active">
                    <router-link to="/activities" title="Activities">
                        <icon-side-bar-activity/>
                    </router-link>
                </li>
                <li class="app-sidebar__item">
                    <router-link to="/routines" title="Routines">
                        <icon-side-bar-routines/>
                    </router-link>
                </li>
                <li class="app-sidebar__item">
                    <router-link to="/goals" title="Goals">
                        <icon-side-bar-goals/>
                    </router-link>
                </li>
            </ul>
            <a href="#" class="app-sidebar__link-profile"></a>
        </nav>
    </aside>
</template>

<style scoped>
#app-sidebar {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 4rem;
    box-sizing: border-box;
    border-top: 1px solid #EAEAEA;
    justify-content: center;
    z-index: 100;
    background-color: white;
}

.app-sidebar__nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
    justify-content: center;
    gap: 2rem;
}

.app-sidebar__items {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    box-sizing: border-box;
}

@media only screen and (min-width: 50rem) {
    #app-sidebar {
        width: 4rem;
        height: 100%;
        border-right: 1px solid #EAEAEA;
        border-top: none;
        box-shadow: 4px 0 5px -2px #EAEAEA;
        padding: 1.2rem 0 1.6rem 0;
    }

    .app-sidebar__nav {
        flex-direction: column;
        justify-content: space-between;
    }

    .app-sidebar__items {
        flex-direction: column;
    }
}

.app-sidebar__item--logo a,
.app-sidebar__item a {
    display: flex;
    justify-content: center;
    align-items: center;
}

.app-sidebar__item--logo svg {
    height: 2.5rem;
    width: 2.5rem;
}

.app-sidebar__item svg {
    height: 1.8rem;
    width: 1.8rem;
}

.app-sidebar__item svg {
    fill: #909090;
}

.app-sidebar__item svg:hover,
.app-sidebar__item svg:active {
    fill: #606060;
}

.app-sidebar__item--active svg,
.app-sidebar__item--active:hover svg,
.app-sidebar__item--active:active svg {
    fill: #B243C5;
}

.app-sidebar__link-profile {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 2.4rem;
    border: 1px solid #909090;
}
</style>
<template>
    <app-side-bar></app-side-bar>
    <app-bread-crumbs></app-bread-crumbs>
    <section class="app-content">
        <router-view></router-view>
    </section>
</template>

<script>
function isMobileView() {
    const sideBarElem = document.getElementById('app-sidebar');
    if (sideBarElem) {
        return getComputedStyle(sideBarElem).borderTopStyle !== 'none';
    }
    return false;
}

export default {
    methods: {
        onResize() {
            let isMobile = isMobileView();
            if (this.isMobileView !== isMobile) {
                this.$store.commit('updateMobile', isMobile);
            }
        },
    },
    computed: {
        isMobileView() {
            return this.$store.getters.mobile;
        },
    },
    mounted() {
        const mobileView = isMobileView();
        this.$store.commit('updateMobile', mobileView);
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize);
        })
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.onResize);
    },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@250;300;350;400;500&display=swap');

html {
    color: #444343;
    font-weight: 300;
    font-family: Inter, Helvetica, monospace;
    overflow: hidden;
}

.app-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding-top: 3.6rem;
    padding-bottom: 4rem;
}

.app-content__main {
    display: flex;
    flex-direction: row;
    height: 100%;
}

@media only screen and (min-width: 50rem) {
    .app-content {
        height: 100%;
        margin-left: 4rem;
        padding-bottom: 0;
    }
}
</style>
<script setup>
</script>
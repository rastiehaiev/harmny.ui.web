<template>
    <app-side-bar></app-side-bar>
    <app-bread-crumbs></app-bread-crumbs>
    <section class="app-content">
        <router-view></router-view>
    </section>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@250;300;350;400;500&display=swap');

html {
    color: #444343;
    font-weight: 300;
    font-family: Inter, Helvetica, monospace;
    box-sizing: border-box;
    overflow: hidden;
}

.app-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding-top: 3.6rem;
    padding-bottom: 4rem;
}

@media only screen and (min-width: 50rem) {
    .app-content {
        height: 100%;
        margin-left: 4rem;
    }
}
</style>
<script setup>
</script>
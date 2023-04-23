<template>
    <li class="list-item" :style="{ '--level': level, '--background-on-hover': backgroundOnHover }">
        <router-link v-if="!!routeTo" :to="routeTo" class="list-item__container" :class="height">
            <div class="list-item__left-icon-area">
                <slot name="left-icon"></slot>
            </div>
            <div class="list-item__base-content-area">
                <slot name="base-content"></slot>
            </div>
            <div class="list-item__action-items-area">
                <slot name="action-items"></slot>
            </div>
        </router-link>
        <div class="list-item__container" :class="height" v-else>
            <!-- Exact copy of router-link content -->
            <div class="list-item__left-icon-area">
                <slot name="left-icon"></slot>
            </div>
            <div class="list-item__base-content-area">
                <slot name="base-content"></slot>
            </div>
            <div class="list-item__action-items-area">
                <slot name="action-items"></slot>
            </div>
        </div>
        <slot v-if="!!this.$slots['additional-content']" name="additional-content"></slot>
    </li>
</template>

<script>
export default {
    name: 'ListItem',
    props: {
        routeTo: {
            type: String,
            default: undefined,
            required: false,
        },
        level: {
            type: Number,
            default: 0,
        },
        height: {
            type: String,
            default: 'height-a',
        },
        backgroundOnHover: {
            type: String,
            default: '#0FC8E714',
        },
    },
};
</script>

<style>
.list-item {
    box-sizing: border-box;
    width: 100%;
}

.list-item a {
    text-decoration: none;
}

.list-item__container {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    gap: 0.6rem;
    padding-left: calc(var(--level, 0) * 0.7rem + 1.2rem);
    padding-right: 0.8rem;
}

.list-item__container:hover {
    background-color: var(--background-on-hover);
}

.list-item__container.router-link-active {
    background-color: var(--background-on-hover);
}

.list-item__left-icon-area {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
}

.list-item__left-icon-area svg {
    height: 1rem;
    width: 1rem;
    fill: #909090;
    flex-shrink: 0;
}

.list-item__container:hover .list-item__left-icon-area svg {
    fill: #606060;
}

.list-item__base-content-area {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-grow: 100;
    flex-shrink: 100;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.list-item__base-content-area h4 {
    color: #444343;
    font-size: 1rem;
    font-weight: 300;
    font-family: Inter, Helvetica, monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.list-item__base-content-area input {
    width: 100%;
    color: #444343;
    font-size: 1rem;
    font-weight: 300;
    font-family: Inter, Helvetica, monospace;
    /* input default styling reset*/
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    -o-appearance: none;
    appearance: none;
    padding: 0;
    background: none;
    border: none;
    border-radius: 0;
    outline: none;
}

.list-item__action-items-area {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.2rem;
}

.list-item__action-items-area svg {
    height: 1.4rem;
    width: 1.4rem;
}
</style>

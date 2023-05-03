<template>
    <li class="list-item" :style="{ '--level': level, '--background-on-hover': backgroundOnHover, '--padding-left': paddingLeft, '--padding-right': paddingRight }">
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
    name: 'hy-list-item',
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
        paddingLeft: {
            type: String,
            default: '0',
        },
        paddingRight: {
            type: String,
            default: '0',
        },
    },
};
</script>

<style>
.list-item {
    width: 100%;
    cursor: pointer;
}

.list-item a {
    text-decoration: none;
}

.list-item__container {
    width: 100%;
    display: flex;
    gap: 0.6rem;
    padding-left: calc(var(--level, 0) * 0.7rem + var(--padding-left, 0));
    padding-right: var(--padding-right, 0);
    box-sizing: border-box;
}

.list-item__container:hover {
    background-color: var(--background-on-hover);
}

.list-item__container.router-link-active {
    background-color: var(--background-on-hover);
}

.list-item__left-icon-area {
    display: flex;
    align-items: center;
    justify-content: center;
}

.list-item__left-icon-area i {
    font-size: 1rem;
    color: #909090;
    flex-shrink: 0;
}

.list-item__container:hover .list-item__left-icon-area i {
    color: #606060;
}

.list-item__base-content-area {
    display: flex;
    align-items: center;
    flex-grow: 100;
    flex-shrink: 100;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.list-item__base-content-area h3,
.list-item__base-content-area h4 {
    color: #444343;
    font-weight: 300;
    font-family: Inter, Helvetica, monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.list-item__base-content-area h3 {
    font-size: 0.9rem;
}

.list-item__base-content-area h4 {
    font-size: 1rem;
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
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.2rem;
}
</style>

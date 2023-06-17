<template>
    <li class="hy-list-item"
        :style="{ '--level': level, '--background-on-hover': backgroundOnHover, '--padding-left': paddingLeft, '--padding-right': paddingRight, '--list-item-height': height, '--cursor': cursor }">
        <hy-tooltip :message-code="errorCode" :is-error="!!errorCode">
            <template #target>
                <router-link v-if="!!routeTo" :to="routeTo" class="hy-list-item__container" :class="{'hy-list-item__container--error': !!errorCode}">
                    <slot name="content"></slot>
                </router-link>
                <div v-else class="hy-list-item__container" :class="{'hy-list-item__container--error': !!errorCode}">
                    <slot name="content"></slot>
                </div>
            </template>
        </hy-tooltip>
        <slot v-if="!!this.$slots['additional-content']" name="additional-content"></slot>
    </li>
</template>

<script>
import HyTooltip from "@/components/basic/elements/HyTooltip.vue";

export default {
    name: 'hy-list-item',
    components: {HyTooltip},
    props: {
        routeTo: {
            type: String,
            default: undefined,
        },
        height: {
            type: String,
            default: undefined,
        },
        level: {
            type: Number,
            default: 0,
        },
        backgroundOnHover: {
            type: String,
            default: 'var(--color-side-list-hover)',
        },
        paddingLeft: {
            type: String,
            default: '0',
        },
        paddingRight: {
            type: String,
            default: '0',
        },
        cursor: {
            type: String,
        },
        errorCode: {
            type: String,
        },
    },
};
</script>

<style>
.hy-list-item {
    display: flex;
    width: 100%;
    flex-direction: column;
}

.hy-list-item a {
    text-decoration: none;
}

.hy-list-item__container:hover {
    background-color: var(--background-on-hover);
}

.hy-list-item__container.router-link-active {
    background-color: var(--background-on-hover);
}

.hy-list-item__container {
    display: flex;
    width: 100%;
    height: var(--list-item-height);
    flex-direction: column;
    padding-left: calc(var(--level, 0) * 0.7rem + var(--padding-left, 0));
    padding-right: var(--padding-right, 0);
    box-sizing: border-box;
    cursor: var(--cursor);
}

.hy-list-item__container:hover:not(.hy-list-item__container--error) .hy-list-item-content .hy-list-item-content__left-icon-area i {
    color: var(--color-gray-3);
}

.hy-list-item__container.hy-list-item__container--error {
    background-color: var(--color-red-0);
}

.hy-list-item__container.hy-list-item__container--error input {
    color: var(--color-red-2);
}

.hy-list-item__container.hy-list-item__container--error .hy-list-item-content__left-icon-area i {
    color: var(--color-red-2);
}

</style>

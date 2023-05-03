<template>
    <hy-list-item padding-right="1rem" padding-left="1rem">
        <template #left-icon>
            <slot name="left-icon"></slot>
        </template>
        <template #base-content>
            <slot name="base-content"></slot>
        </template>
    </hy-list-item>
</template>

<script>
import HyListItem from "@/components/basic/elements/HyListItem.vue";

export default {
    name: 'activity-menu-item',
    components: {HyListItem},
}
</script>

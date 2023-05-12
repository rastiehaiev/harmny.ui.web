<template>
    <div class="hy-list-item-content">
        <div class="hy-list-item-content__left-icon-area">
            <slot name="left-icon"></slot>
        </div>
        <div class="hy-list-item-content__base-content-area">
            <slot name="base-content"></slot>
        </div>
        <div class="hy-list-item-content__action-items-area">
            <slot name="action-items"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'hy-list-item-content',
    props: {
    },
};
</script>

<style>

.hy-list-item-content {
    display: flex;
    width: 100%;
    height: 100%;
    gap: 0.6rem;
    justify-content: center;
    align-items: center;
}

.hy-list-item-content__left-icon-area {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
}

.hy-list-item-content__left-icon-area i {
    font-size: 1rem;
    color: var(--color-gray-2);
}

.list-item__container:hover .hy-list-item-content__left-icon-area i {
    color: var(--color-gray-3);
}

.hy-list-item-content__base-content-area {
    display: flex;
    height: 100%;
    align-items: center;
    flex-grow: 100;
    flex-shrink: 100;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.hy-list-item-content__base-content-area h3,
.hy-list-item-content__base-content-area h4 {
    color: var(--color-gray-4);
    font-weight: 300;
    font-family: Inter, Helvetica, monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.hy-list-item-content__base-content-area h3 {
    font-size: 0.9rem;
}

.hy-list-item-content__base-content-area h4 {
    font-size: 1rem;
}

.hy-list-item-content__base-content-area input {
    width: 100%;
    color: var(--color-gray-4);
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

.hy-list-item-content__action-items-area {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    gap: 0.2rem;
}

</style>

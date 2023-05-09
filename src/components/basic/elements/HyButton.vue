<template>
    <button :class="buttonClassName">
        <slot></slot>
    </button>
</template>

<script>
export default {
    data() {
        return {
            buttonClassName: `hy-button-${this.buttonStyle}`
        };
    },
    props: {
        buttonStyle: {
            type: String,
            default: 'blue',
        },
    }
};
</script>

<style scoped>
button {
    outline: inherit;
    border-width: 1px;
    border-radius: 0.2rem;
    padding: 0.25rem 0.8rem;
    font-size: 1rem;
    cursor: pointer;
}

button:active {
    color: white;
}

button.hy-button-blue {
    color: #147c98;
    border-color: #147c98;
    border-style: solid;
    background-color: white;
}

button.hy-button-blue:hover {
    background-color: rgba(20, 124, 152, 0.2);
}

button.hy-button-blue:active {
    background-color: var(--color-link);
}

button.hy-button-red {
    color: var(--color-red-2);
    border-color: var(--color-red-2);
    border-style: solid;
    background-color: white;
}

button.hy-button-red:hover {
    background-color: rgba(255, 0, 0, 0.2);
}

button.hy-button-red:active {
    background-color: red;
}
</style>
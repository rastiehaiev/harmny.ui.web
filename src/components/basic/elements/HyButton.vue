<template>
  <div class="hy-icon-button" :class="themeClassName">
    <span v-if="!!text">{{ text }}</span>
    <w-icon v-if="!!icon">{{ icon }}</w-icon>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      default: false,
    },
    icon: {
      type: String,
    },
    text: {
      type: String,
    },
    theme: {
      type: String,
      default: 'green',
    },
  },
  computed: {
    themeClassName() {
      return `theme-${this.disabled ? 'disabled' : this.theme}`
    },
  },
}
</script>

<style scoped>
.hy-icon-button {
  display: flex;
  flex-direction: row;
  padding: 0.1rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  gap: 0.4rem;
  align-items: center;
  justify-content: center;
  border: 1px solid;
}

.hy-icon-button span {
  padding: 0 1rem;
}

.hy-icon-button.theme-disabled {
  background-color: var(--color-gray-0);
  cursor: not-allowed;
  color: var(--color-gray-2);
}

.hy-icon-button.theme-green {
  border-color: var(--theme-green-color-4);
  color: var(--theme-green-color-4);
  background-color: var(--theme-green-color-1);
}

.hy-icon-button.theme-green:hover {
  background-color: var(--theme-green-color-2);
}

.hy-icon-button.theme-green:active {
  background-color: var(--theme-green-color-3);
}

.hy-icon-button.theme-orange {
  border-color: var(--theme-orange-color-4);
  color: var(--theme-orange-color-4);
  background-color: var(--theme-orange-color-1);
}

.hy-icon-button.theme-orange:hover {
  background-color: var(--theme-orange-color-2);
}

.hy-icon-button.theme-orange:active {
  background-color: var(--theme-orange-color-3);
}

.hy-icon-button.theme-red {
  border-color: var(--theme-red-color-4);
  color: var(--theme-red-color-4);
  background-color: var(--theme-red-color-1);
}

.hy-icon-button.theme-red:hover {
  background-color: var(--theme-red-color-2);
}

.hy-icon-button.theme-red:active {
  background-color: var(--theme-red-color-3);
}
</style>

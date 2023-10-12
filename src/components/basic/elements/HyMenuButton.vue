<template>
  <div class="hy-menu-button" :class="'theme-' + theme">
    <slot v-if="icon" name="icon">
      <w-icon>{{ icon }}</w-icon>
    </slot>
    <slot name="default"></slot>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
    },
    theme: {
      type: String,
      default: 'green',
    },
  },
}
</script>

<style scoped>
.hy-menu-button {
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
  /*  border: 1px solid rgb(213, 128, 0);
    color: rgb(213, 128, 0);
    background-color: rgb(255, 238, 185);*/
  /*  border: 1px solid rgb(213, 128, 0);
    color: rgb(213, 128, 0);
    background-color: rgb(255, 238, 185);*/
}

.hy-menu-button.theme-green {
  border-color: var(--theme-green-color-4);
  color: var(--theme-green-color-4);
  background-color: var(--theme-green-color-1);
}

.hy-menu-button.theme-green:hover {
  background-color: var(--theme-green-color-2);
}

.hy-menu-button.theme-green:active {
  background-color: var(--theme-green-color-3);
}

.hy-menu-button.theme-orange {
  border-color: var(--theme-orange-color-4);
  color: var(--theme-orange-color-4);
  background-color: var(--theme-orange-color-1);
}

.hy-menu-button.theme-orange:hover {
  background-color: var(--theme-orange-color-2);
}

.hy-menu-button.theme-orange:active {
  background-color: var(--theme-orange-color-3);
}

.hy-menu-button.theme-red {
  border-color: var(--theme-red-color-4);
  color: var(--theme-red-color-4);
  background-color: var(--theme-red-color-1);
}

.hy-menu-button.theme-red:hover {
  background-color: var(--theme-red-color-2);
}

.hy-menu-button.theme-red:active {
  background-color: var(--theme-red-color-3);
}
</style>

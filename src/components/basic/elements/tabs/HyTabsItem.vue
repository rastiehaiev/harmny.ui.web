<template>
  <li class="hy-tabs-header__item" :class="[{ 'hy-tabs__selected': !!selected }]">
    <slot name="default"></slot>
  </li>
</template>

<script>
export default {
  props: ['selected'],
}
</script>

<style scoped>
.hy-tabs-header__item {
  cursor: pointer;
  color: var(--color-gray-2);
  display: flex;
  height: 100%;
  align-items: center;
  padding: 0 0.8rem;
  box-sizing: content-box;
}

.hy-tabs-header__item.hy-tabs__selected,
.hy-tabs-header__item:hover {
  color: var(--color-magenta-1);
  border-bottom: 2px solid var(--color-magenta-1);
}
</style>

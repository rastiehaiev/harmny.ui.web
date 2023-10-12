<template>
  <header class="hy-tabs-header">
    <ul>
      <slot name="default"></slot>
    </ul>
  </header>
</template>

<script>
export default {
  name: 'hy-tabs',
}
</script>

<style scoped>
.hy-tabs-header {
  width: 100%;
  height: 2.8rem;
  border-bottom: 1px solid var(--color-gray-0);
  flex-shrink: 0;
}

.hy-tabs-header ul {
  margin-left: 0.8rem;
  list-style: none;
  display: flex;
  height: 100%;
  gap: 0.8rem;
}
</style>

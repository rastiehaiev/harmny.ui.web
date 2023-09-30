<template>
  <li
    class="hy-list-item"
    :style="{
      '--level': level,
      '--background-on-hover': backgroundOnHover,
      '--padding-left': paddingLeft,
      '--padding-right': paddingRight,
      '--cursor': cursor,
    }"
  >
    <slot name="content"></slot>
    <slot v-if="!!this.$slots['additional-content']" name="additional-content"></slot>
  </li>
</template>

<script>
export default {
  name: 'hy-list-item',
  props: {
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
  },
}
</script>

<style>
.hy-list-item {
  display: flex;
  width: 100%;
  flex-direction: column;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
}
</style>

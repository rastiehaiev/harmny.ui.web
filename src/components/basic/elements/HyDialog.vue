<template>
  <Teleport to="#teleport-area">
    <div v-show="show" class="hy-dialog-container__background-area">
      <OnClickOutside class="hy-dialog-container__dialog-area" @trigger="onCloseDialog()">
        <header class="hy-dialog-container__header">
          <h3>{{ headerText }}</h3>
          <w-icon @click="onCloseDialog()">mdi mdi-close</w-icon>
        </header>
        <slot name="default"></slot>
      </OnClickOutside>
    </div>
  </Teleport>
</template>

<script>
import { OnClickOutside } from '@vueuse/components'

export default {
  components: { OnClickOutside },
  props: {
    show: {
      default: false,
    },
    headerText: {
      default: '',
    },
  },
  emits: ['onDialogCloseEvent'],
  methods: {
    onCloseDialog() {
      this.$emit('onDialogCloseEvent')
    },
  },
}
</script>

<style scoped>
.hy-dialog-container__background-area {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #0000004d;
  z-index: 2000;
}

.hy-dialog-container__dialog-area {
  display: flex;
  flex-direction: column;
  background-color: white;
  align-items: center;
  max-height: 80%;
  max-width: 80%;
}

.hy-dialog-container__header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-gray-0);
  padding: 0.8rem 1rem 0.8rem 1.6rem;
  gap: 1.5rem;
}

.hy-dialog-container__header h3 {
  flex-grow: 0;
  font-size: 1.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-gray-2);
}

.hy-dialog-container__header i {
  font-size: 1.5rem;
  color: var(--color-gray-2);
  cursor: pointer;
}
</style>

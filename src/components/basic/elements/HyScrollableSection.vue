<template>
  <section class="hy-scrollable">
    <slot name="default"></slot>
  </section>
</template>

<style scoped>
.hy-scrollable {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  /* Works on Firefox */
  scrollbar-width: thin;
  scrollbar-color: rgba(15, 200, 231, 0.3) rgba(255, 255, 255, 0);
}

/* Works on Chrome, Edge, and Safari */
.hy-scrollable::-webkit-scrollbar {
  width: 0.3rem;
  display: block;
}

.hy-scrollable::-webkit-scrollbar-thumb {
  background-color: rgba(15, 200, 231, 0.3);
  border-radius: 0.2rem;
}
</style>

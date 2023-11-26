<template>
  <div class="hy-container-wfrs-main"  :class="{'hy-scrollable': isMobile}">
    <div class="hy-container-wfrs-left" :class="{'hy-scrollable': !isMobile}">
      <slot name="left"></slot>
    </div>
    <div class="hy-container-wfrs-right">
      <div class="hy-container-wfrs-right__fixed" :class="{'hy-scrollable': !isMobile}">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isMobile() {
      return this.$store.getters.isMobileView
    },
  },
}
</script>

<style scoped>
.hy-container-wfrs-main {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: inherit;
}

@media only screen and (min-width: 50rem) {
  .hy-container-wfrs-main {
    flex-direction: row;
  }
}

.hy-container-wfrs-left {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border-right: none;
  border-bottom: 1px solid var(--color-gray-0);
}

@media only screen and (min-width: 50rem) {
  .hy-container-wfrs-left {
    width: 75%;
    border-bottom: none;
    border-right: 1px solid var(--color-gray-0);
  }
}

.hy-container-wfrs-right {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  flex-grow: 10;
  background-color: rgb(250, 255, 247);
}

@media only screen and (min-width: 50rem) {
  .hy-container-wfrs-right {
    width: 25%;
  }
}

.hy-container-wfrs-right__fixed {
  display: flex;
  flex-direction: column;
  position: relative;

}
</style>
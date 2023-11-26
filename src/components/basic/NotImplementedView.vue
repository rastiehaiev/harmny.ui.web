<template>
  <section class="not-implemented-view__container">
    <section class="not-implemented-view__sub-section">
      <HyScrollableSection>
        <div>
          <w-icon>mdi mdi-account-hard-hat-outline</w-icon
          ><slot name="header">This page is not yet implemented.</slot>
        </div>
        <div>
          <slot name="default"></slot>
        </div>
      </HyScrollableSection>
    </section>
  </section>
</template>

<script setup>
import HyScrollableSection from '@/components/basic/elements/HyScrollableSection.vue'
</script>

<style scoped>
.not-implemented-view__container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.not-implemented-view__sub-section {
  width: 80%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1.2rem;
  line-height: 2rem;
  color: var(--color-gray-2);
}

@media only screen and (min-width: 50rem) {
  .not-implemented-view__sub-section {
    width: 54%;
    height: 70%;
  }
}
</style>

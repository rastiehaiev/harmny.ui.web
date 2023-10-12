<template>
  <slot name="header"></slot>
  <section class="activity-section__content">
    <div class="activity-section__content-container">
      <slot name="default"></slot>
    </div>
  </section>
</template>

<style>
.activity-section__content {
  padding: 2rem;
  display: flex;
  overflow-y: auto;
}

@media only screen and (min-width: 50rem) {
  .activity-section__content {
    padding: 2rem;
  }
}

/* Works on Firefox */
.activity-section__content {
  scrollbar-width: thin;
  scrollbar-color: rgba(15, 200, 231, 0.3) rgba(255, 255, 255, 0);
}

/* Works on Chrome, Edge, and Safari */
.activity-section__content::-webkit-scrollbar {
  width: 0.3rem;
  display: block;
}

.activity-section__content::-webkit-scrollbar-thumb {
  background-color: rgba(15, 200, 231, 0.3);
  border-radius: 0.2rem;
}

.activity-section__content-container {
  height: max-content;
  display: flex;
  width: 100%;
  flex-direction: column;
}
</style>

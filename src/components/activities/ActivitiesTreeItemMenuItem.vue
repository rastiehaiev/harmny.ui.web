<template>
  <hy-list-item padding-left="1rem" padding-right="0.6rem" cursor="pointer">
    <template #content>
      <div class="activities-tree-item-menu-item">
        <hy-list-item-content>
          <template #left-icon>
            <slot name="left-icon"></slot>
          </template>
          <template #base-content>
            <slot name="base-content"></slot>
          </template>
        </hy-list-item-content>
      </div>
    </template>
  </hy-list-item>
</template>

<script>
import HyListItem from '@/components/basic/elements/HyListItem.vue'
import HyListItemContent from '@/components/basic/elements/HyListItemContent.vue'

export default {
  name: 'activities-tree-item-menu-item',
  components: { HyListItemContent, HyListItem },
}
</script>

<style scoped>
.activities-tree-item-menu-item {
  height: 2rem;
}
</style>

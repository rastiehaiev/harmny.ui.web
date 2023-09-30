<template>
  <ul class="activities-tree-item-menu-container">
    <activities-tree-item-menu-item
      v-if="activity.group && level < 2"
      @click.prevent="startActivityCreation(true, activity.id)"
    >
      <template #left-icon>
        <w-icon>mdi mdi-folder-plus-outline</w-icon>
      </template>
      <template #base-content>
        <h3>Create activity group</h3>
      </template>
    </activities-tree-item-menu-item>
    <activities-tree-item-menu-item
      v-if="activity.group && level < 3"
      @click.prevent="startActivityCreation(false, activity.id)"
    >
      <template #left-icon>
        <w-icon>mdi mdi-rocket-launch</w-icon>
      </template>
      <template #base-content>
        <h3>Create activity</h3>
      </template>
    </activities-tree-item-menu-item>
    <activities-tree-item-menu-item @click.prevent="copyToClipboard(activity.id)">
      <template #left-icon>
        <w-icon>mdi mdi-content-copy</w-icon>
      </template>
      <template #base-content>
        <h3>Copy link</h3>
      </template>
    </activities-tree-item-menu-item>
    <activities-tree-item-menu-item @click.prevent="startActivityRenaming(activity)">
      <template #left-icon>
        <w-icon>mdi mdi-rename</w-icon>
      </template>
      <template #base-content>
        <h3>Rename</h3>
      </template>
    </activities-tree-item-menu-item>
    <activities-tree-item-menu-item @click.prevent="requestActivityDeletion(activity)">
      <template #left-icon>
        <w-icon style="color: var(--color-red-2)">mdi mdi-delete-outline</w-icon>
      </template>
      <template #base-content>
        <h3 style="color: var(--color-red-2)">Delete</h3>
      </template>
    </activities-tree-item-menu-item>
  </ul>
</template>

<script>
import ActivitiesTreeItemMenuItem from '@/components/activities/ActivitiesTreeItemMenuItem.vue'
import configProvider from '@/utils/config-provider'

import { useClipboard } from '@vueuse/core'

const { copy } = useClipboard()

export default {
  name: 'activities-tree-item-menu',
  components: { ActivitiesTreeItemMenuItem },
  props: ['activity', 'level'],
  emits: ['onActivityEdit'],
  methods: {
    startActivityCreation(group, parentActivityId) {
      this.$store.dispatch('activities/startActivityCreation', { group, parentActivityId })
    },
    startActivityRenaming(activity) {
      this.$store.dispatch('activities/startActivityRenaming', { activityId: activity.id })
      this.$emit('onActivityEdit', activity.name)
    },
    copyToClipboard(activityId) {
      copy(`${configProvider.uiActivitiesUrl}/${activityId}`)
    },
    requestActivityDeletion(activity) {
      this.$store.commit('notifications/setActivityToBeDeleted', activity)
    },
  },
}
</script>

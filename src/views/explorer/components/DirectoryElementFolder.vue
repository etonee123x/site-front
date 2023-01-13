<template>
  <router-link :to="element.url">
    <div class="directory-element directory-element_folder">
      <div class="directory-element__title">
        {{ element.name }}
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { FolderItem } from '@types';

defineProps<{ element: FolderItem }>();
</script>

<style scoped lang="scss">
@import '../assets/styles/directory-element.scss';
.directory-element {
  &_folder {
    background-color: $color-folders;
    .hoverable &:hover {
      background-color: darken($color-folders, 10%);
    }
  }
}
</style>

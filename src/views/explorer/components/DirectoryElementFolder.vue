<template>
  <router-link :to="element.url">
    <div class="directory-element folder">
      <div class="directory-element__title">
        <slot>{{ element.name }}</slot>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { ItemFolder } from '@types';

defineProps<{ element: ItemFolder }>();
</script>

<style scoped lang="scss">
.folder {
  background-color: $color-folders;
  &:hover {
    background-color: darken($color-folders, 10%);
  }
}
</style>

<template>
  <RouterLink :to="element.url" :class="[$s.explorerElement, $s.explorerElement_folder]">
    <div :class="$s.title" class="w-2/3 overflow-x-auto overflow-y-hidden m-2">
      {{ element.name }}
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { type ItemFolder } from '@shared/src/types';

defineProps<{
  element: ItemFolder;
}>();
</script>

<style module="$s">
@import '../assets/styles/explorerElement.css';

.explorerElement.explorerElement_folder {
  @apply bg-folders;
  @apply with-hover:bg-folders-hovered with-hover:text-[initial];
}
</style>

<template>
  <RouterLink :to="element.url" class="explorerElement explorerElement_folder">
    <div class="explorerElement__title w-2/3 overflow-x-auto overflow-y-hidden m-2">
      {{ element.name }}
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { ItemFolder } from '@etonee123x/shared/helpers/folderData';

defineProps<{
  element: ItemFolder;
}>();
</script>

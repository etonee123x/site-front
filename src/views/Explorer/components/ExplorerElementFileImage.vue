<template>
  <ElementFileWrapper :element>
    <img class="max-w-full mx-auto" :src="element.src" :alt="element.name" />
  </ElementFileWrapper>
</template>

<script setup lang="ts">
import type { ItemImage } from '@etonee123x/shared/helpers/folderData';

import ElementFileWrapper from './_ElementFileWrapper.vue';

import type { ItemWithSinceTimestamps } from '@/api/folderData';

defineProps<{
  element: ItemWithSinceTimestamps<ItemImage>;
}>();
</script>

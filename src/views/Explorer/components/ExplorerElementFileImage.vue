<template>
  <ElementFileWrapper :element @keydown.enter="onClick" @click="onClick">
    <img class="max-w-full mx-auto" :src="element.src" :alt="element.name" />
  </ElementFileWrapper>
</template>

<script setup lang="ts">
import type { ItemImage } from '@etonee123x/shared/helpers/folderData';

import ElementFileWrapper from './_ElementFileWrapper.vue';

import { useGalleryStore } from '@/stores/gallery';
import type { ItemWithSinceTimestamps } from '@/api/folderData';

const props = defineProps<{
  element: ItemWithSinceTimestamps<ItemImage>;
}>();

const { loadGalleryItemFromCurrentExplorerFolder } = useGalleryStore();

const onClick = () => loadGalleryItemFromCurrentExplorerFolder(props.element);
</script>

<template>
  <ElementFileWrapper :element="element" @keydown.enter="onClick" @click="onClick">
    <div class="flex justify-center max-w-full">
      <img class="max-w-full" :src="element.src" />
    </div>
  </ElementFileWrapper>
</template>

<script setup lang="ts">
import { isItemImage, isItemVideo, type ItemImage } from '@shared/src/types';
import { storeToRefs } from 'pinia';
import { pick } from '@shared/src/utils';

import ElementFileWrapper from './_ElementFileWrapper.vue';

import { useGalleryStore } from '@/stores/gallery';
import { useExplorerStore } from '@/stores/explorer';

const props = defineProps<{
  element: ItemImage;
}>();

const explorerStore = useExplorerStore();
const { folderElements } = storeToRefs(explorerStore);
const { loadGalleryItem } = useGalleryStore();

const onClick = () =>
  loadGalleryItem(
    pick(props.element, ['name', 'src']),
    folderElements.value.reduce<NonNullable<Parameters<typeof loadGalleryItem>[1]>>(
      (acc, folderElement) =>
        isItemImage(folderElement) || isItemVideo(folderElement) ? [...acc, pick(folderElement, ['name', 'src'])] : acc,
      [],
    ),
  );
</script>

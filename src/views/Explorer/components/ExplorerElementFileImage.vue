<template>
  <ElementFileWrapper :element @keydown.enter="onClick" @click="onClick">
    <div class="flex justify-center max-w-full">
      <img class="max-w-full" :src="element.src" :alt="element.name" />
    </div>
  </ElementFileWrapper>
</template>

<script setup lang="ts">
import type { ItemImage } from '@etonee123x/shared/helpers/folderData';

import ElementFileWrapper from './_ElementFileWrapper.vue';

import { useGalleryStore } from '@/stores/gallery';
import type { WithSinceBirthtime } from '@/api/folderData';

const props = defineProps<{
  element: ItemImage & WithSinceBirthtime;
}>();

const { loadGalleryItemFromCurrentExplorerFolder } = useGalleryStore();

const onClick = () => loadGalleryItemFromCurrentExplorerFolder(props.element);
</script>

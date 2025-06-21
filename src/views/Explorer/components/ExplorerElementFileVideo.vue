<template>
  <ElementFileWrapper :element @click="onClick">
    <PreviewVideo :src="element.src" />
  </ElementFileWrapper>
</template>

<script setup lang="ts">
import type { ItemVideo } from '@etonee123x/shared/helpers/folderData';

import ElementFileWrapper from './_ElementFileWrapper.vue';

import PreviewVideo from '@/components/PreviewVideo.vue';
import { useGalleryStore } from '@/stores/gallery';

const props = defineProps<{
  element: ItemVideo;
}>();

const galleryStore = useGalleryStore();

const onClick = () => galleryStore.loadGalleryItemFromCurrentExplorerFolder(props.element);
</script>

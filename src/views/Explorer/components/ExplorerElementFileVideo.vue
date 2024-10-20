<template>
  <ElementFileWrapper :element @click="onClick">
    <PreviewVideo :src="element.src" />
  </ElementFileWrapper>
</template>

<script setup lang="ts">
import { type ItemVideo } from '@shared/src/types';

import ElementFileWrapper from './_ElementFileWrapper.vue';

import PreviewVideo from '@/components/PreviewVideo.vue';
import { useGalleryStore } from '@/stores/gallery';

const props = defineProps<{
  element: ItemVideo;
}>();

const { loadGalleryItemFromCurrentExplorerFolder } = useGalleryStore();

const onClick = () => loadGalleryItemFromCurrentExplorerFolder(props.element);
</script>

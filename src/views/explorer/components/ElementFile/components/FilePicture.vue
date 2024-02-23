<template>
  <ElementFile :element="element" @click="onClick">
    <div :class="$style.wrapper">
      <img :class="$style.thePicture" :src="element.src" />
    </div>
  </ElementFile>
</template>

<script setup lang="ts">
import { type ItemPicture } from '@shared/src/types';

import { useGalleryStore } from '@/stores/gallery';
import ElementFile from '@/views/Explorer/components/ElementFile';

const props = defineProps<{
  element: ItemPicture;
}>();

const { loadImage } = useGalleryStore();

const onClick = () => loadImage(props.element);
</script>

<style module lang="scss">
.wrapper {
  display: flex;
  justify-content: center;
  max-width: 100%;
}

.thePicture {
  max-width: 100%;
}
</style>

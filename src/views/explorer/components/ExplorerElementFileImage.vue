<template>
  <ElementFileWrapper :element="element" @keydown.enter="onClick" @click="onClick">
    <div :class="$style.wrapper">
      <img :class="$style.theImage" :src="element.src" />
    </div>
  </ElementFileWrapper>
</template>

<script setup lang="ts">
import { type ItemImage } from '@shared/src/types';

import ElementFileWrapper from './_ElementFileWrapper.vue';

import { useGalleryStore } from '@/stores/gallery';

const props = defineProps<{
  element: ItemImage;
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

.theImage {
  max-width: 100%;
}
</style>

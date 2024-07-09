<template>
  <ElementFileWrapper :element="element" @keydown.enter="onClick" @click="onClick">
    <div class="flex justify-center max-w-full">
      <img class="max-w-full" :src="element.src" />
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

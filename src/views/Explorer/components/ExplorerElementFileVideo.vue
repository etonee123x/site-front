<template>
  <ElementFileWrapper :element="element" @keydown.enter="onClick" @click="onClick">
    <div class="flex justify-center max-w-full">
      <video class="max-w-full" :src="element.src" controls />
    </div>
  </ElementFileWrapper>
</template>

<script setup lang="ts">
import { type ItemVideo } from '@shared/src/types';

import ElementFileWrapper from './_ElementFileWrapper.vue';

import { useGalleryStore } from '@/stores/gallery';

const props = defineProps<{
  element: ItemVideo;
}>();

const { loadVideo } = useGalleryStore();

const onClick = () => loadVideo(props.element);
</script>

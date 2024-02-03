import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import type { ItemPicture } from '@types';

export const useGalleryStore = defineStore('gallery', () => {
  const theImage = ref<ItemPicture | null>(null);

  const isImageLoaded = computed(() => Boolean(theImage.value));

  const loadImage = (img: ItemPicture) => {
    theImage.value = img;
  };

  const removeImage = () => {
    theImage.value = null;
  };

  return {
    theImage,
    isImageLoaded,

    loadImage,
    removeImage,
  };
});

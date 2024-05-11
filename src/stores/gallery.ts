import { defineStore } from 'pinia';
import { shallowRef, computed } from 'vue';
import { type ItemImage } from '@shared/src/types';

export const useGalleryStore = defineStore('gallery', () => {
  const theImage = shallowRef<ItemImage | null>(null);

  const isImageLoaded = computed(() => Boolean(theImage.value));

  const loadImage = (img: ItemImage) => {
    theImage.value = img;
  };

  const unloadImage = () => {
    theImage.value = null;
  };

  return {
    theImage,
    isImageLoaded,

    loadImage,
    unloadImage,
  };
});

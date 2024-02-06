import { defineStore } from 'pinia';
import { shallowRef, computed } from 'vue';
import { type ItemPicture } from '@types';

export const useGalleryStore = defineStore('gallery', () => {
  const theImage = shallowRef<ItemPicture | null>(null);

  const isImageLoaded = computed(() => Boolean(theImage.value));

  const loadImage = (img: ItemPicture) => {
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

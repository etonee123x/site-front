import { ItemPicture } from '@types';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useGalleryStore = defineStore('gallery', () => {
  const theImg = ref<ItemPicture | null>(null);

  const isImgSelected = computed(() => Boolean(theImg.value));

  const loadImage = (img: ItemPicture) => {
    theImg.value = img;
  };

  const removeImage = () => {
    theImg.value = null;
  };

  return {
    theImg,
    isImgSelected,
    loadImage,
    removeImage,
  };
});

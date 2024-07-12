import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { type ItemImage, type ItemVideo } from '@shared/src/types';
import { useCycleList } from '@vueuse/core';

type GalleryItem = Pick<ItemImage | ItemVideo, 'src' | 'name'>;

export const useGalleryStore = defineStore('gallery', () => {
  const galleryItems = ref<Array<GalleryItem>>([]);

  const isGalleryItemLoaded = computed(() => Boolean(galleryItem.value));

  const loadGalleryItem = (_galleryItem: GalleryItem, _galleryItems: Array<GalleryItem> = []) => {
    galleryItem.value = _galleryItem;
    galleryItems.value = _galleryItems;
  };

  const unloadGalleryItem = () => {
    galleryItems.value = [];
  };

  const {
    next,
    prev,
    state: galleryItem,
  } = useCycleList(galleryItems, {
    getIndexOf: (value, list) => list.findIndex((item) => item?.src === value?.src),
  });

  return {
    galleryItem,
    galleryItems,
    isGalleryItemLoaded,

    loadGalleryItem,
    unloadGalleryItem,

    next,
    prev,
  };
});

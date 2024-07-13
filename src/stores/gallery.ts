import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { isExtVideo, type ItemImage, type ItemVideo } from '@shared/src/types';
import { useCycleList } from '@vueuse/core';

import { getFileUrlExt } from '@/utils/url';

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

  const isCurrentGalleryItemVideo = computed(() => {
    if (!galleryItem.value) {
      return false;
    }

    const maybeExt = getFileUrlExt(galleryItem.value.src);
    if (!maybeExt) {
      return false;
    }

    return isExtVideo(maybeExt);
  });

  return {
    galleryItem,
    galleryItems,

    isGalleryItemLoaded,
    isCurrentGalleryItemVideo,

    loadGalleryItem,
    unloadGalleryItem,

    next,
    prev,
  };
});

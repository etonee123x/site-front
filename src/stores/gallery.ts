import { defineStore } from 'pinia';
import { shallowRef, computed, ref } from 'vue';
import { type ItemImage, type ItemVideo } from '@shared/src/types';

type GalleryItem = Pick<ItemImage | ItemVideo, 'src' | 'name'>;

export const useGalleryStore = defineStore('gallery', () => {
  const galleryItem = shallowRef<GalleryItem | null>(null);

  const galleryItems = ref<Array<GalleryItem>>([]);

  const isGalleryItemLoaded = computed(() => Boolean(galleryItem.value));

  const loadGalleryItem = (_galleryItem: GalleryItem, _galleryItems: Array<GalleryItem> = []) => {
    galleryItem.value = _galleryItem;
    galleryItems.value = _galleryItems;
  };

  const unloadGalleryItem = () => {
    galleryItem.value = null;
    galleryItems.value = [];
  };

  return {
    galleryItem,
    galleryItems,
    isGalleryItemLoaded,

    loadGalleryItem,
    unloadGalleryItem,
  };
});

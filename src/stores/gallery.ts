import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { isExtVideo, isItemImage, isItemVideo, type ItemImage, type ItemVideo } from '@shared/src/types';
import { useCycleList } from '@vueuse/core';
import { pick } from '@shared/src/utils';

import { useExplorerStore } from './explorer';

import { getFileUrlExt } from '@/utils/url';

type GalleryItem = Pick<ItemImage | ItemVideo, 'src' | 'name'>;

export const useGalleryStore = defineStore('gallery', () => {
  const explorerStore = useExplorerStore();
  const { folderElements } = storeToRefs(explorerStore);

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

  const loadGalleryItemFromCurrentExplorerFolder = (explorerElement: ItemImage | ItemVideo) =>
    loadGalleryItem(
      pick(explorerElement, ['name', 'src']),
      folderElements.value.reduce<NonNullable<Parameters<typeof loadGalleryItem>[1]>>(
        (acc, folderElement) =>
          isItemImage(folderElement) || isItemVideo(folderElement)
            ? [...acc, pick(folderElement, ['name', 'src'])]
            : acc,
        [],
      ),
    );

  return {
    galleryItem,
    galleryItems,

    isGalleryItemLoaded,
    isCurrentGalleryItemVideo,

    loadGalleryItem,
    unloadGalleryItem,
    loadGalleryItemFromCurrentExplorerFolder,

    next,
    prev,
  };
});

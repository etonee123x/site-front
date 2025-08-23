import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useCycleList } from '@vueuse/core';
import { pick } from '@etonee123x/shared/utils/pick';

import { useExplorerStore } from './explorer';

import { getFileUrlExtension } from '@/utils/url';
import {
  extensionToFileType,
  FILE_TYPES,
  ITEM_TYPES,
  type ItemImage,
  type ItemVideo,
} from '@etonee123x/shared/helpers/folderData';

type GalleryItem = Pick<ItemImage | ItemVideo, 'src' | 'name'>;

export const useGalleryStore = defineStore('gallery', () => {
  const explorerStore = useExplorerStore();

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
  } = useCycleList<GalleryItem | undefined>(galleryItems, {
    getIndexOf: (value, list) => list.findIndex((item) => item?.src === value?.src),
  });

  const isCurrentGalleryItemVideo = computed(() => {
    if (!galleryItem.value) {
      return false;
    }

    const maybeExt = getFileUrlExtension(galleryItem.value.src);

    if (!maybeExt) {
      return false;
    }

    return extensionToFileType(maybeExt) === FILE_TYPES.VIDEO;
  });

  const loadGalleryItemFromCurrentExplorerFolder = (
    explorerElement: ItemImage | ItemVideo,
    folderData = explorerStore.folderData,
  ) =>
    loadGalleryItem(
      pick(explorerElement, ['name', 'src']),
      folderData?.items.reduce<Array<GalleryItem>>(
        (acc, folderElement) =>
          folderElement.itemType === ITEM_TYPES.FILE &&
          (folderElement.fileType === FILE_TYPES.IMAGE || folderElement.fileType === FILE_TYPES.VIDEO)
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

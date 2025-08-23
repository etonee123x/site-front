import { defineStore } from 'pinia';
import { shallowReactive } from 'vue';

import { usePlayerStore } from '@/stores/player';
import { getFolderData as _getFolderData, type FolderDataWithSinceTimestamps } from '@/api/folderData';
import { useAsyncStateApi } from '@/composables/useAsyncStateApi';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { isNotNil } from '@etonee123x/shared/utils/isNotNil';
import { useGalleryStore } from '@/stores/gallery';
import { FILE_TYPES, ITEM_TYPES } from '@etonee123x/shared/helpers/folderData';

const moduleURLResolver = (url: string) => `/explorer${url.replace(/^\/explorer/, '')}`;

export const useExplorerStore = defineStore('explorer', () => {
  const playerStore = usePlayerStore();
  const galleryStore = useGalleryStore();

  const routePathToFolderData = shallowReactive<Record<string, FolderDataWithSinceTimestamps>>({});

  const {
    state: folderData,
    execute: getFolderData,
    isLoading: isLoadingGetFolderData,
  } = useAsyncStateApi(async (to: RouteLocationNormalizedLoaded) => {
    const routePath = to.path.replace(/^\/explorer/, '');

    const maybeFolderData = routePathToFolderData[routePath];

    const __folderData = isNotNil(maybeFolderData) ? maybeFolderData : await _getFolderData(routePath);

    const _folderData = {
      ...__folderData,
      items: __folderData.items.map((item) => ({
        ...item,
        url: moduleURLResolver(item.url),
      })),
      lvlUp: __folderData.lvlUp && moduleURLResolver(__folderData.lvlUp),
      navigationItems: __folderData.navigationItems.map((navigationItem) => ({
        ...navigationItem,
        link: moduleURLResolver(navigationItem.link),
      })),
    };

    routePathToFolderData[routePath] = _folderData;

    if (!_folderData.linkedFile) {
      galleryStore.unloadGalleryItem();

      return _folderData;
    }

    const playlist = _folderData.items.filter(
      (item) => item.itemType === ITEM_TYPES.FILE && item.fileType === FILE_TYPES.AUDIO,
    );

    if (_folderData.linkedFile.fileType === FILE_TYPES.AUDIO) {
      playerStore.loadRealPlaylist(playlist);
      playerStore.loadTrack(_folderData.linkedFile);
    } else {
      playerStore.loadPotentialPlaylist(playlist);
    }

    if (_folderData.linkedFile.fileType === FILE_TYPES.IMAGE || _folderData.linkedFile.fileType === FILE_TYPES.VIDEO) {
      galleryStore.loadGalleryItemFromCurrentExplorerFolder(_folderData.linkedFile, _folderData);
    }

    return _folderData;
  });

  return {
    // SSR compatibility
    routePathToFolderData,

    getFolderData,
    isLoadingGetFolderData,
    folderData,
  };
});

import { defineStore } from 'pinia';
import { computed, shallowReactive } from 'vue';
import { isItemAudio } from '@etonee123x/shared/helpers/folderData';

import { usePlayerStore } from '@/stores/player';
import { getFolderData as _getFolderData, type FolderDataWithSinceTimestamps } from '@/api/folderData';
import { useAsyncStateApi } from '@/composables/useAsyncStateApi';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { isNotNil } from '@etonee123x/shared/utils/isNotNil';

const moduleURLResolver = (url: string) => `/explorer${url}`;

export const useExplorerStore = defineStore('explorer', () => {
  const { loadTrack, loadRealPlaylist, loadPotentialPlaylist } = usePlayerStore();

  const routePathToFolderData = shallowReactive<Record<string, FolderDataWithSinceTimestamps>>({});

  const {
    state: folderData,
    execute: getFolderData,
    isLoading: isLoadingGetFolderData,
  } = useAsyncStateApi(async (to: RouteLocationNormalizedLoaded) => {
    const routePath = to.path.replace(/^\/explorer/, '');

    const maybeFolderData = routePathToFolderData[routePath];

    if (isNotNil(maybeFolderData)) {
      return maybeFolderData;
    }

    return _getFolderData(routePath).then((_folderData) => {
      routePathToFolderData[routePath] = _folderData;

      const playlist = _folderData.items.filter((item) => isItemAudio(item));

      if (!playlist.length) {
        return _folderData;
      }

      if (_folderData.linkedFile && isItemAudio(_folderData.linkedFile)) {
        loadRealPlaylist(playlist);
        loadTrack(_folderData.linkedFile);
      } else {
        loadPotentialPlaylist(playlist);
      }

      return _folderData;
    });
  });

  const navigationItems = computed(
    () =>
      folderData.value?.navigationItems.map((navigationItem) => ({
        ...navigationItem,
        link: moduleURLResolver(navigationItem.link),
      })) ?? [],
  );

  const linkedFile = computed(() => folderData.value?.linkedFile);

  const folderElements = computed(
    () =>
      folderData.value?.items.map((item) => ({
        ...item,
        url: moduleURLResolver(item.url),
      })) ?? [],
  );

  const lvlUp = computed(() => folderData.value?.lvlUp && moduleURLResolver(folderData.value.lvlUp));

  return {
    routePathToFolderData,

    getFolderData,
    isLoadingGetFolderData,

    folderElements,
    lvlUp,
    navigationItems,
    linkedFile,
  };
});

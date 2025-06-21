import { defineStore } from 'pinia';
import { computed, watch } from 'vue';
import { isItemAudio } from '@etonee123x/shared/helpers/folderData';

import { usePlayerStore } from '@/stores/player';
import { getFolderData as _getFolderData } from '@/api/folderData';
import { useAsyncStateApi } from '@/composables/useAsyncStateApi';

const moduleURLResolver = (url: string) => `/explorer${url}`;

export const useExplorerStore = defineStore('explorer', () => {
  const { loadTrack, loadRealPlaylist, loadPotentialPlaylist } = usePlayerStore();

  const {
    state: folderData,
    execute: getFolderData,
    isLoading: isLoadingGetFolderData,
  } = useAsyncStateApi(_getFolderData);

  const handlePlayer = () => {
    if (!folderData.value) {
      return;
    }

    const playlist = folderData.value.items.filter(isItemAudio);

    if (!playlist.length) {
      return;
    }

    if (folderData.value.linkedFile && isItemAudio(folderData.value.linkedFile)) {
      loadRealPlaylist(playlist);
      loadTrack(folderData.value.linkedFile);
    } else {
      loadPotentialPlaylist(playlist);
    }
  };

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

  watch(folderData, handlePlayer);

  return {
    getFolderData,
    isLoadingGetFolderData,

    folderElements,
    lvlUp,
    navigationItems,
    linkedFile,
  };
});

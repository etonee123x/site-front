import { defineStore } from 'pinia';
import { computed, shallowRef, watch } from 'vue';
import { type FolderData, isItemAudio } from '@shared/src/types';

import { usePlayerStore } from '@/stores/player';
import { getFolderData as _getFolderData } from '@/api';

const moduleURLResolver = (url: string) => `/explorer${url}`;

export const useExplorerStore = defineStore('explorer', () => {
  const { loadTrack, loadRealPlaylist, loadPotentialPlaylist } = usePlayerStore();

  const folderData = shallowRef<FolderData>();

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

  const getFolderData = async (url: string) =>
    _getFolderData(url)
      .then((_folderData) => {
        folderData.value = _folderData;
      })
      .catch(console.error);

  watch(folderData, handlePlayer);

  return {
    folderElements,
    lvlUp,
    navigationItems,
    linkedFile,

    getFolderData,
  };
});

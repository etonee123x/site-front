import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { createURL } from '@/utils';
import { FolderData, isItemAudio } from '@types';
import { usePlayerStore } from '@/stores/player';
import { getFolderData as _getFolderData } from '@/api';

const moduleURLResolver = (url: string) => '/' + createURL('explorer', url);

const data = ref<FolderData>();

export const useExplorerStore = defineStore('explorer', () => {
  const { loadTrack, loadRealPlaylist, loadPotentialPlaylist } = usePlayerStore();

  const handlePlayer = () => {
    if (!data.value) {
      return;
    }

    const playlist = data.value.items.filter(isItemAudio);
    if (!playlist.length) {
      return;
    }

    if (data.value.linkedFile && isItemAudio(data.value.linkedFile)) {
      loadRealPlaylist(playlist);
      loadTrack(data.value.linkedFile);
    } else {
      loadPotentialPlaylist(playlist);
    }
  };

  const navigation = computed(
    () =>
      data.value?.navigation.map(item => ({
        ...item,
        link: moduleURLResolver(item.link),
      })) ?? [],
  );

  const linkedFile = computed(() => data.value?.linkedFile);

  const folderElements = computed(
    () =>
      data.value?.items.map(item => ({
        ...item,
        url: moduleURLResolver(item.url),
      })) ?? [],
  );

  const lvlUp = computed(() => data.value?.lvlUp && moduleURLResolver(data.value.lvlUp));

  const getFolderData = async (url: string) => {
    data.value = await _getFolderData(url);
  };

  watch(data, handlePlayer);

  return {
    folderElements,
    lvlUp,
    navigation,
    linkedFile,

    getFolderData,
  };
});

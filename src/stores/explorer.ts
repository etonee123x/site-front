import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { createURL, isIn } from '@/utils';
import { FolderData, AudioItem, AUDIO_EXT } from '@types';
import { usePlayerStore } from '@/stores/player';
import { get } from '@/http';

const apiRoute = createURL(import.meta.env.VITE_API_URL, import.meta.env.VITE_GET_FOLDER_DATA_ROUTE);

const ROUTE_NAME = 'explorer';
const moduleURLResolver = (url: string) => '/' + createURL(ROUTE_NAME, url);

const data = ref<FolderData>();

export const useExplorerStore = defineStore(ROUTE_NAME, () => {
  const { loadTrack, loadRealPlaylist, loadPotentialPlaylist } = usePlayerStore();

  const handlePlayer = () => {
    if (!data.value) {
      return;
    }

    const playlist = data.value.items.filter(item => isIn(item.ext, AUDIO_EXT)) as AudioItem[];
    if (!playlist.length) {
      return;
    }

    if (data.value.linkedFile && isIn(data.value.linkedFile.ext, AUDIO_EXT)) {
      loadRealPlaylist(playlist);
      loadTrack(data.value.linkedFile as AudioItem);
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

  const lvlUp = computed(() => (data.value?.lvlUp ? moduleURLResolver(data.value.lvlUp) : null));

  const fetchData = async (url: string) => {
    data.value = await get(createURL(apiRoute, url));
  };

  watch(data, handlePlayer, { deep: true });

  return { fetchData, folderElements, lvlUp, navigation, linkedFile };
});

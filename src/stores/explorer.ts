import { API_URL } from '@/config';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { removeSlashes } from '@/utils';
import { NavItem, Item, FolderData, LinkedFile, AudioExts } from '@types';
import { ComputedRef } from 'vue';
import { usePlayerStore } from '@/stores/player';

const { loadTrack } = usePlayerStore();

const API_MODULE_NAME = 'get-folder-data/';
const ROUTE_NAME = 'explorer';

export const useExplorerStore = defineStore('explorer', () => {
  const data = ref<FolderData>();

  const moduleURLResolver = (url: string) => removeSlashes(`/${ROUTE_NAME}/${url}`);

  const getRoute = (url: string) => moduleURLResolver(`/${currentDirectory.value}/${url}`);

  const navigation: ComputedRef<NavItem[]> = computed(() =>
    (data.value?.navigation ?? []).map((item: NavItem) => ({
      ...item,
      link: moduleURLResolver(item.link),
    }))
  );

  const linkedFile: ComputedRef<LinkedFile | null> = computed(() => data.value?.linkedFile ?? null);
  watch(linkedFile, (linkedFile: LinkedFile | null) => {
    if (!linkedFile) return;
    if (Object.values(AudioExts).includes(linkedFile.ext as AudioExts))
      loadTrack({ ...linkedFile, url: `${API_URL}/content/${linkedFile.url}` });
  });

  const folderElements: ComputedRef<Item[]> = computed(() =>
    (data.value?.filesList ?? []).map((item: Item) => ({
      ...item,
      url: getRoute(item.url),
    }))
  );

  const currentDirectory = computed(() => data.value?.currentDirectory);

  const paths = computed(() => {
    if (!data.value?.paths) return {};
    const { lvlUp, abs, rel } = data.value.paths;
    return {
      lvlUp: lvlUp ? moduleURLResolver(lvlUp) : lvlUp,
      abs: moduleURLResolver(abs),
      rel: moduleURLResolver(rel),
    };
  });

  const fetchData = async (url: string): Promise<void> => {
    const response = await fetch(removeSlashes(`${API_URL}/${API_MODULE_NAME}/${url.replace('explorer', '')}`), {
      method: 'GET',
    });
    data.value = await response.json();
  };

  return { fetchData, folderElements, data, paths, navigation, linkedFile };
});

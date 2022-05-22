import { API_URL } from '@/config';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { removeSlashes } from '@/utils';

const API_MODULE_NAME = 'get-folder-data/';
const ROUTE_NAME = 'explorer';

export const useExplorerStore = defineStore('explorer', () => {
  const data = ref();

  const folderElements = computed(() => data.value?.filesList);

  const currentDirectory = computed(() => data.value?.currentDirectory);

  const paths = computed(() => {
    if (!data.value?.paths) return {};
    const { lvlUp, abs, rel } = data.value.paths;
    return {
      lvlUp: lvlUp ? `/${ROUTE_NAME}${lvlUp}` : lvlUp,
      abs: `/${ROUTE_NAME}${abs}`,
      rel: `/${ROUTE_NAME}${rel}`,
    };
  });

  const fetchData = async (url: string) => {
    const response = await fetch(API_URL + API_MODULE_NAME + url, { method: 'GET' });
    data.value = await response.json();
  };

  const getFullRoute = (url: string) => removeSlashes(`/${ROUTE_NAME}/${currentDirectory.value}/${url}`);

  return { fetchData, getFullRoute, data, folderElements, paths };
});

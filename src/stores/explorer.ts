import { API_URL } from '@/config';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { removeSlashes } from '@/utils';
import { NavItem, Item } from '@types';

const API_MODULE_NAME = 'get-folder-data/';
const ROUTE_NAME = 'explorer';

export const useExplorerStore = defineStore('explorer', () => {
  const data = ref();

  const moduleURLResolver = (url: string) => removeSlashes(`/${ROUTE_NAME}/${url}`);

  const getFullRoute = (url: string) => moduleURLResolver(`/${currentDirectory.value}/${url}`);

  const navigation = computed(() =>
    (data.value?.navigation ?? []).map((item: NavItem) => ({
      ...item,
      link: moduleURLResolver(item.link),
    }))
  );

  const folderElements = computed(() =>
    (data.value?.filesList ?? []).map((item: Item) => ({
      ...item,
      url: getFullRoute(item.url),
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

  const fetchData = async (url: string) => {
    const response = await fetch(API_URL + API_MODULE_NAME + url, { method: 'GET' });
    data.value = await response.json();
  };

  return { fetchData, folderElements, data, paths, navigation };
});

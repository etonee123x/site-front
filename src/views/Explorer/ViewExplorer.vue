<template>
  <div>
    <ExplorerNavbar />
    <div class="l-container flex flex-col gap-2 py-2">
      <LazyExplorerElementSystem v-if="lvlUp" @keydown.enter="onClickLvlUp" @click="onClickLvlUp">
        ...
      </LazyExplorerElementSystem>
      <component
        :is="getComponent(folderElement)"
        v-for="(folderElement, idx) in explorerStore.folderElements"
        :key="idx"
        :element="folderElement"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter, type RouteLocationNormalizedLoaded } from 'vue-router';
import { type Item, isItemFolder, isItemAudio, isItemImage } from '@shared/src/types';
import { storeToRefs } from 'pinia';

import ExplorerNavbar from './components/ExplorerNavbar.vue';

import { useExplorerStore } from '@/stores/explorer';
import { goToPage404 } from '@/composables/goToPage404';

const LazyExplorerElementSystem = defineAsyncComponent(() => import('./components/ExplorerElementSystem.vue'));
const LazyExplorerElementFolder = defineAsyncComponent(() => import('./components/ExplorerElementFolder.vue'));
const LazyExplorerElementFileAudio = defineAsyncComponent(() => import('./components/ExplorerElementFileAudio.vue'));
const LazyExplorerElementFileImage = defineAsyncComponent(() => import('./components/ExplorerElementFileImage.vue'));

const explorerStore = useExplorerStore();
const { lvlUp } = storeToRefs(explorerStore);

const route = useRoute();
const router = useRouter();

const onClickLvlUp = () => {
  if (!lvlUp.value) {
    return;
  }

  router.push(lvlUp.value);
};

const getComponent = (item: Item) => {
  switch (true) {
    case isItemFolder(item):
      return LazyExplorerElementFolder;
    case isItemAudio(item):
      return LazyExplorerElementFileAudio;
    case isItemImage(item):
      return LazyExplorerElementFileImage;
    default:
      return LazyExplorerElementSystem;
  }
};

const fetchData = (route: RouteLocationNormalizedLoaded) =>
  explorerStore.getFolderData(route.fullPath.replace('/explorer', '')).catch(goToPage404);

fetchData(route);

onBeforeRouteUpdate(fetchData);
</script>

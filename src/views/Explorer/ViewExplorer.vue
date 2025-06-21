<template>
  <div>
    <ExplorerNavbar />
    <div class="layout-container mx-auto flex flex-col gap-2 py-2">
      <LazyExplorerElementSystem v-if="explorerStore.lvlUp" @keydown.enter="onClickLvlUp" @click="onClickLvlUp">
        ...
      </LazyExplorerElementSystem>
      <component
        :is="getComponent(folderElement)"
        v-for="(folderElement, idx) in explorerStore.folderElements"
        :element="folderElement"
        :key="idx"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter, type RouteLocationNormalizedLoaded } from 'vue-router';
import { isItemFolder, isItemAudio, isItemImage, isItemVideo } from '@etonee123x/shared/helpers/folderData';
import type { Item } from '@etonee123x/shared/helpers/folderData';

import ExplorerNavbar from './components/ExplorerNavbar.vue';

import { useExplorerStore } from '@/stores/explorer';
import { goToPage404 } from '@/composables/goToPage404';

const LazyExplorerElementSystem = defineAsyncComponent(() => import('./components/ExplorerElementSystem.vue'));
const LazyExplorerElementFolder = defineAsyncComponent(() => import('./components/ExplorerElementFolder.vue'));
const LazyExplorerElementFileAudio = defineAsyncComponent(() => import('./components/ExplorerElementFileAudio.vue'));
const LazyExplorerElementFileImage = defineAsyncComponent(() => import('./components/ExplorerElementFileImage.vue'));
const LazyExplorerElementFileVideo = defineAsyncComponent(() => import('./components/ExplorerElementFileVideo.vue'));

const explorerStore = useExplorerStore();

const route = useRoute();
const router = useRouter();

const onClickLvlUp = () => {
  if (!explorerStore.lvlUp) {
    return;
  }

  router.push(explorerStore.lvlUp);
};

const getComponent = (item: Item) => {
  switch (true) {
    case isItemFolder(item):
      return LazyExplorerElementFolder;
    case isItemAudio(item):
      return LazyExplorerElementFileAudio;
    case isItemImage(item):
      return LazyExplorerElementFileImage;
    case isItemVideo(item):
      return LazyExplorerElementFileVideo;
    default:
      return LazyExplorerElementSystem;
  }
};

const fetchData = (to: RouteLocationNormalizedLoaded) =>
  explorerStore.getFolderData(to.fullPath.replace('/explorer', '')).catch(goToPage404);

fetchData(route);

onBeforeRouteUpdate((to) => void fetchData(to));
</script>

<template>
  <div>
    <ExplorerNavbar />
    <div :class="$style.content">
      <LazyExplorerElementSystem v-if="lvlUp" @click="onClickLvlUp">...</LazyExplorerElementSystem>
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
import { type Item, isItemFolder, isItemAudio, isItemPicture } from '@shared/src/types';
import { storeToRefs } from 'pinia';

import ExplorerNavbar from './components/ExplorerNavbar.vue';

import { useExplorerStore } from '@/stores/explorer';
import { RouteName } from '@/router';

const LazyExplorerElementSystem = defineAsyncComponent(() => import('./components/ExplorerElementSystem.vue'));
const LazyExplorerElementFolder = defineAsyncComponent(() => import('./components/ExplorerElementFolder.vue'));
const LazyExplorerElementFileAudio = defineAsyncComponent(() => import('./components/ExplorerElementFileAudio.vue'));
const LazyExplorerElementFilePicture = defineAsyncComponent(
  () => import('./components/ExplorerElementFilePicture.vue'),
);

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
    case isItemPicture(item):
      return LazyExplorerElementFilePicture;
    default:
      return LazyExplorerElementSystem;
  }
};

const fetchData = (route: RouteLocationNormalizedLoaded) =>
  explorerStore.getFolderData(route.fullPath.replace('/explorer', '')).catch(() => {
    router.push({ name: RouteName.Explorer });
  });

fetchData(route);

onBeforeRouteUpdate(fetchData);
</script>

<style lang="scss" module>
.content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 0;
}
</style>

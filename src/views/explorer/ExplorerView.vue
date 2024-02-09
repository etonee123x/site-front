<template>
  <div>
    <NavBar />
    <div :class="$style.content">
      <LazyElementSystem v-if="lvlUp" @click="onClickLvlUp(lvlUp)">...</LazyElementSystem>
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
import { type Item, isItemFolder, isItemAudio, isItemPicture } from '@types';
import { storeToRefs } from 'pinia';

import { useExplorerStore } from '@/stores/explorer';
import { RouteName } from '@/router';
import NavBar from '@/views/explorer/components/NavBar.vue';

const LazyElementSystem = defineAsyncComponent(() => import('@/views/explorer/components/ElementSystem.vue'));
const LazyElementFolder = defineAsyncComponent(() => import('@/views/explorer/components/ElementFolder.vue'));
const LazyFileAudio = defineAsyncComponent(
  () => import('@/views/explorer/components/ElementFile/components/FileAudio.vue'),
);
const LazyFilePicture = defineAsyncComponent(
  () => import('@/views/explorer/components/ElementFile/components/FilePicture.vue'),
);

const explorerStore = useExplorerStore();
const { lvlUp } = storeToRefs(explorerStore);

const route = useRoute();
const router = useRouter();

const onClickLvlUp = router.push;

const getComponent = (item: Item) => {
  switch (true) {
    case isItemFolder(item):
      return LazyElementFolder;
    case isItemAudio(item):
      return LazyFileAudio;
    case isItemPicture(item):
      return LazyFilePicture;
    default:
      return LazyElementSystem;
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

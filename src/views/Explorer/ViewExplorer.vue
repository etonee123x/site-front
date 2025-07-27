<template>
  <div>
    <ExplorerNavbar />
    <section class="layout-container mx-auto flex flex-col gap-2 py-2">
      <nav v-if="explorerStore.lvlUp || elements.folders.length" class="contents">
        <LazyExplorerElementSystem v-if="explorerStore.lvlUp" :to="explorerStore.lvlUp" tag="RouterLink">
          ...
        </LazyExplorerElementSystem>
        <LazyExplorerElementFolder v-for="folder in elements.folders" :element="folder" :key="folder.src">
          {{ folder.name }}
        </LazyExplorerElementFolder>
      </nav>
      <component :is="itemFileToComponent(file)" v-for="file in elements.files" :element="file" :key="file.src" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { onBeforeRouteUpdate, useRoute, type RouteLocationNormalizedLoaded } from 'vue-router';
import { isItemFolder, isItemAudio, isItemImage, isItemVideo } from '@etonee123x/shared/helpers/folderData';
import type { ItemFile, ItemFolder } from '@etonee123x/shared/helpers/folderData';

import ExplorerNavbar from './components/ExplorerNavbar.vue';

import { useExplorerStore } from '@/stores/explorer';
import { goToPage404 } from '@/composables/goToPage404';
import { clientOnly } from '@/helpers/clientOnly';
import type { ItemWithSinceTimestamps } from '@/api/folderData';

const LazyExplorerElementSystem = defineAsyncComponent(() => import('./components/ExplorerElementSystem.vue'));
const LazyExplorerElementFolder = defineAsyncComponent(() => import('./components/ExplorerElementFolder.vue'));

const LazyExplorerElementFileAudio = defineAsyncComponent(() => import('./components/ExplorerElementFileAudio.vue'));
const LazyExplorerElementFileImage = defineAsyncComponent(() => import('./components/ExplorerElementFileImage.vue'));
const LazyExplorerElementFileVideo = defineAsyncComponent(() => import('./components/ExplorerElementFileVideo.vue'));

const explorerStore = useExplorerStore();

const route = useRoute();

const itemFileToComponent = (itemFile: ItemFile) => {
  switch (true) {
    case isItemAudio(itemFile):
      return LazyExplorerElementFileAudio;
    case isItemImage(itemFile):
      return LazyExplorerElementFileImage;
    case isItemVideo(itemFile):
      return LazyExplorerElementFileVideo;
    default:
      return LazyExplorerElementSystem;
  }
};

const elements = computed(() =>
  explorerStore.folderElements.reduce<{
    folders: Array<ItemWithSinceTimestamps<ItemFolder>>;
    files: Array<ItemWithSinceTimestamps<ItemFile>>;
  }>(
    (elements, folderElement) =>
      isItemFolder(folderElement)
        ? { ...elements, folders: elements.folders.concat(folderElement) }
        : { ...elements, files: elements.files.concat(folderElement) },
    { folders: [], files: [] },
  ),
);

const fetchData = (to: RouteLocationNormalizedLoaded) => explorerStore.getFolderData(to).catch(goToPage404);

clientOnly(() => fetchData(route));

onBeforeRouteUpdate((to) => void fetchData(to));
</script>

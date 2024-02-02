<template>
  <div class="explorer">
    <NavBar class="explorer__navbar" />
    <div class="explorer__content">
      <DirectoryElementSystem
        v-if="explorerStore.lvlUp"
        @click="navigate(explorerStore.lvlUp)"
      >
        ...
      </DirectoryElementSystem>
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
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { useExplorerStore } from '@/stores/explorer';
import { createURL } from '@/utils';
import { Item, isItemFolder, isItemAudio, isItemPicture } from '@types';
import { ROUTE_NAME } from '@/router/';

import NavBar from '@/views/explorer/components/NavBar.vue';
import DirectoryElementSystem from '@/views/explorer/components/DirectoryElementSystem.vue';

import type { RouteLocationNormalizedLoaded } from 'vue-router';

const DirectoryElementFolder
  = defineAsyncComponent(() => import('@/views/explorer/components/DirectoryElementFolder.vue'));
const DirectoryElementAudio
  = defineAsyncComponent(() => import('@/views/explorer/components/DirectoryElementAudio.vue'));
const DirectoryElementPicture
  = defineAsyncComponent(() => import('@/views/explorer/components/DirectoryElementPicture.vue'));

const explorerStore = useExplorerStore();
const route = useRoute();
const router = useRouter();

const navigate = async (url: string) => {
  await router.push(url);
};

const getComponent = (item: Item) => {
  switch (true) {
    case isItemFolder(item):
      return DirectoryElementFolder;
    case isItemAudio(item):
      return DirectoryElementAudio;
    case isItemPicture(item):
      return DirectoryElementPicture;
    default:
      return DirectoryElementSystem;
  }
};

const fetchData = (route: RouteLocationNormalizedLoaded) => {
  explorerStore.fetchData(createURL(...(route.params.link || [])))
    .catch(() => router.push({ name: ROUTE_NAME.EXPLORER }));
};

fetchData(route);

onBeforeRouteUpdate(fetchData);
</script>

<style lang="scss">
.explorer {
  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem 0;
  }
}
</style>

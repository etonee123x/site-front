<template>
  <div class="explorer">
    <NavBar class="explorer__navbar" />
    <div class="explorer__content">
      <DirectoryElementSystem v-if="explorerStore.lvlUp" @click="() => navigate(explorerStore.lvlUp as string)">
        ...
      </DirectoryElementSystem>
      <component
        :is="getType(folderElement)"
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
import { Item, AUDIO_EXT, PICTURE_EXT, ITEM_TYPE } from '@types';
import { ROUTES_NAMES } from '@/types';

import NavBar from '@/views/explorer/components/NavBar.vue';
import DirectoryElementSystem from '@/views/explorer/components/DirectoryElementSystem.vue';

import type { RouteLocationNormalizedLoaded } from 'vue-router';

const explorerStore = useExplorerStore();
const route = useRoute();
const router = useRouter();

const navigate = async (url: string) => {
  await router.push(url);
};

const getType = (item: Item) => {
  switch (true) {
    case item.type === ITEM_TYPE.FOLDER: {
      return defineAsyncComponent(() => import('@/views/explorer/components/DirectoryElementFolder.vue'));
    }

    case Object.values(AUDIO_EXT).includes(item.ext as AUDIO_EXT): {
      return defineAsyncComponent(() => import('@/views/explorer/components/DirectoryElementAudio.vue'));
    }

    case Object.values(PICTURE_EXT).includes(item.ext as PICTURE_EXT): {
      return defineAsyncComponent(() => import('@/views/explorer/components/DirectoryElementPicture.vue'));
    }
  }
};

const fetchData = (route: RouteLocationNormalizedLoaded) => {
  explorerStore.fetchData(createURL(...(route.params.link || []))).catch(async () => {
    await router.push({ name: ROUTES_NAMES.EXPLORER });
  });
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
  }
}
</style>

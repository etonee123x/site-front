<template>
  <div class="explorer">
    <NavBar class="explorer__navbar" />
    <div class="explorer__content">
      <DirectoryElementSystem v-if="explorerStore.paths?.lvlUp" @click="navigate(explorerStore.paths.lvlUp as string)"
        >...</DirectoryElementSystem
      >
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
import { Item, AudioExts, PictureExts } from '@types';

import NavBar from '@/views/explorer/components/NavBar.vue';
import DirectoryElementSystem from '@/views/explorer/components/DirectoryElementSystem.vue';

const explorerStore = useExplorerStore();
const route = useRoute();
const router = useRouter();

const navigate = (url: string) => {
  router.push(url);
};

const getType = (item: Item) => {
  if (item.type === 'folder')
    return defineAsyncComponent(() => import('@/views/explorer/components/DirectoryElementFolder.vue'));
  if (Object.values(AudioExts).includes(item.ext as AudioExts))
    return defineAsyncComponent(() => import('@/views/explorer/components/DirectoryElementAudio.vue'));
  if (Object.values(PictureExts).includes(item.ext as PictureExts))
    return defineAsyncComponent(() => import('@/views/explorer/components/DirectoryElementPicture.vue'));
};

explorerStore.fetchData(route.fullPath);

onBeforeRouteUpdate((to) => {
  explorerStore.fetchData(to.fullPath);
});
</script>

<style lang="scss">
.explorer {
  width: 90%;
  margin: auto;

  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}

.directory-element {
  background-color: $color-items;
  border: 2px black solid;
  border-radius: 0.5rem;
  width: 100%;
  cursor: pointer;

  &__title {
    max-width: 70%;
    overflow-x: auto;
    overflow-y: hidden;
    margin: 0.5rem;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    box-shadow: 0px -1px 0px 0px rgba(34, 60, 80, 0.4) inset;
  }

  &__content {
    margin: 0.5rem;
  }

  &__birth-time {
    text-align: right;
    margin: 0.5rem;
  }

  &_file {
    &:hover {
      background-color: darken($color-items, 5%);
    }
  }

  &:hover {
    border-color: $color-details;
    background-color: darken($color-items, 5%);
  }
}
</style>

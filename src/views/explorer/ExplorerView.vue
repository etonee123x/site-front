<template>
  <div class="explorer">
    <NavBar class="explorer__navbar" />
    <div class="explorer__content">
      <FolderElement v-if="explorerStore.paths?.lvlUp" :forced-route="explorerStore.paths?.lvlUp">...</FolderElement>
      <FolderElement
        v-for="(folderElement, idx) in explorerStore.folderElements"
        :key="idx"
        :folder-element="folderElement"
        >{{ folderElement.name }}</FolderElement
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useExplorerStore } from '@/stores/explorer';

import FolderElement from '@/views/explorer/components/FolderElement.vue';
import NavBar from '@/views/explorer/components/NavBar.vue';

const explorerStore = useExplorerStore();

onBeforeRouteUpdate((to) => {
  const url = to.fullPath.replace('explorer', '');
  explorerStore.fetchData(url);
});

const route = useRoute();

explorerStore.fetchData(route.fullPath.replace('explorer', ''));
</script>

<style scoped lang="scss">
.explorer {
  width: 90%;
  margin: auto;

  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__navbar {
  }
}
</style>

<template>
  <div class="explorer">
    <FolderElement v-if="explorerStore.paths?.lvlUp" :forced-route="explorerStore.paths?.lvlUp">...</FolderElement>
    <FolderElement
      v-for="(folderElement, idx) in explorerStore.folderElements"
      :key="idx"
      :folder-element="folderElement"
      >{{ folderElement.name }}</FolderElement
    >
  </div>
</template>

<script setup lang="ts">
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useExplorerStore } from '@/stores/explorer';
import FolderElement from './components/FolderElement.vue';

const explorerStore = useExplorerStore();

onBeforeRouteUpdate((to) => {
  const url = to.fullPath.replace('explorer', '');
  explorerStore.fetchData(url);
});

const route = useRoute();

explorerStore.fetchData(route.fullPath.replace('explorer', ''));
</script>

<template>
  <BasePage :h1="t('content')" class="mx-auto">
    <ExplorerNavbar class="-mt-4" />
    <section class="flex flex-col gap-2">
      <nav v-if="explorerStore.folderData?.lvlUp || elements.folders.length" class="contents">
        <LazyExplorerElementSystem
          v-if="explorerStore.folderData?.lvlUp"
          :to="explorerStore.folderData.lvlUp"
          tag="RouterLink"
        >
          ...
        </LazyExplorerElementSystem>
        <LazyExplorerElementFolder v-for="folder in elements.folders" :element="folder" :key="folder.src">
          {{ folder.name }}
        </LazyExplorerElementFolder>
      </nav>
      <component :is="itemFileToComponent(file)" v-for="file in elements.files" :element="file" :key="file.src" />
    </section>
    <TheDialogGallery />
  </BasePage>
</template>

<i18n lang="yaml">
En:
  content: 'Content'
Ru:
  content: 'Контент'
</i18n>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { onBeforeRouteUpdate, useRoute, type RouteLocationNormalizedLoaded } from 'vue-router';
import { isItemFolder, isItemAudio, isItemImage, isItemVideo } from '@etonee123x/shared/helpers/folderData';
import type { ItemFile, ItemFolder } from '@etonee123x/shared/helpers/folderData';

import ExplorerNavbar from './components/ExplorerNavbar.vue';

import { useExplorerStore } from '@/stores/explorer';
import { useGoToPage404 } from '@/composables/useGoToPage404';
import { clientOnly } from '@/helpers/clientOnly';
import type { ItemWithSinceTimestamps } from '@/api/folderData';
import BasePage from '@/components/ui/BasePage.vue';
import { useI18n } from 'vue-i18n';
import { useHead } from '@unhead/vue';
import { isNotNil } from '@etonee123x/shared/utils/isNotNil';
import TheDialogGallery from './components/TheDialogGallery.vue';

const LazyExplorerElementSystem = defineAsyncComponent(() => import('./components/ExplorerElementSystem.vue'));
const LazyExplorerElementFolder = defineAsyncComponent(() => import('./components/ExplorerElementFolder.vue'));

const LazyExplorerElementFileAudio = defineAsyncComponent(() => import('./components/ExplorerElementFileAudio.vue'));
const LazyExplorerElementFileImage = defineAsyncComponent(() => import('./components/ExplorerElementFileImage.vue'));
const LazyExplorerElementFileVideo = defineAsyncComponent(() => import('./components/ExplorerElementFileVideo.vue'));

const goToPage404 = useGoToPage404();

const { t } = useI18n({ useScope: 'local' });

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

const elements = computed(
  () =>
    explorerStore.folderData?.items.reduce<{
      folders: Array<ItemWithSinceTimestamps<ItemFolder>>;
      files: Array<ItemWithSinceTimestamps<ItemFile>>;
    }>(
      (elements, folderElement) =>
        isItemFolder(folderElement)
          ? {
              ...elements,
              folders: elements.folders.concat(folderElement),
            }
          : {
              ...elements,
              files: elements.files.concat(folderElement),
            },
      {
        folders: [],
        files: [],
      },
    ) ?? {
      folders: [],
      files: [],
    },
);

const fetchData = (to: RouteLocationNormalizedLoaded) => explorerStore.getFolderData(to).catch(goToPage404);

clientOnly(() => fetchData(route));

useHead({
  title: () => {
    const maybeLinkedFileName = explorerStore.folderData?.linkedFile?.name;
    const maybeLastNavigationItemText = explorerStore.folderData?.navigationItems.at(-1)?.text;

    return [
      ...(isNotNil(maybeLastNavigationItemText) ? [maybeLastNavigationItemText] : []),
      ...(isNotNil(maybeLinkedFileName) ? [maybeLinkedFileName] : []),
    ].join(' – ');
  },
});

onBeforeRouteUpdate((to) => void fetchData(to));
</script>

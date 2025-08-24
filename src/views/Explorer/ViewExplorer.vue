<template>
  <BasePage :h1="t('content')" class="mx-auto">
    <ExplorerNavbar class="-mt-4" />
    <div class="flex flex-col gap-2">
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
    </div>
    <TheDialogGallery />
  </BasePage>
</template>

<i18n lang="yaml">
En:
  content: 'Content'
  thatsWhatCloseToMe: 'Thats what close to me. Folder {folderName}, {description}'
  foldersAndFiles: 'folders and files; with music, pictures, videos'
  listenToAudio: 'listen to audio {fileName}, and other @:foldersAndFiles'
  watchTheImage: 'watch the image {fileName}, and other @:foldersAndFiles'
  watchTheVideo: 'watch the video {fileName}, and other @:foldersAndFiles'
Ru:
  content: 'Контент'
  thatsWhatCloseToMe: 'То, что мне близко. Папка {folderName}, {description}'
  foldersAndFiles: 'папки и файлы; с музыкой, картинками, видосиками'
  listenToAudio: 'слушать аудио {fileName}, и другие @:foldersAndFiles'
  watchTheImage: 'смотреть изображение {fileName}, и другие @:foldersAndFiles'
  watchTheVideo: 'смотреть видео {fileName}, и другие @:foldersAndFiles'
</i18n>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { onBeforeRouteUpdate, useRoute, type RouteLocationNormalizedLoaded } from 'vue-router';
import { FILE_TYPES, ITEM_TYPES, type ItemFile, type ItemFolder } from '@etonee123x/shared/helpers/folderData';

import ExplorerNavbar from './components/ExplorerNavbar.vue';

import { useExplorerStore } from '@/stores/explorer';
import { useGoToPage404 } from '@/composables/useGoToPage404';
import { clientOnly } from '@/helpers/clientOnly';
import type { ItemWithSinceTimestamps } from '@/api/folderData';
import BasePage from '@/components/ui/BasePage.vue';
import { useI18n } from 'vue-i18n';
import { useSeoMeta } from '@unhead/vue';
import { isNotNil } from '@etonee123x/shared/utils/isNotNil';
import TheDialogGallery from './components/TheDialogGallery.vue';
import { isNil } from '@etonee123x/shared/utils/isNil';

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
  switch (itemFile.fileType) {
    case FILE_TYPES.AUDIO:
      return LazyExplorerElementFileAudio;
    case FILE_TYPES.IMAGE:
      return LazyExplorerElementFileImage;
    case FILE_TYPES.VIDEO:
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
        folderElement.itemType === ITEM_TYPES.FOLDER
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

const maybeLastNavigationItemText = computed(() => explorerStore.folderData?.navigationItems.at(-1)?.text);
const maybeLinkedFile = computed(() => explorerStore.folderData?.linkedFile);

useSeoMeta({
  title: () =>
    [
      ...(isNotNil(maybeLastNavigationItemText.value) ? [maybeLastNavigationItemText.value] : []),
      ...(isNotNil(maybeLinkedFile.value) ? [maybeLinkedFile.value.name] : []),
    ].join(' – ') || undefined,
  description: () => {
    if (isNil(maybeLastNavigationItemText.value)) {
      return undefined;
    }

    if (!maybeLinkedFile.value) {
      return t('thatsWhatCloseToMe', {
        folderName: maybeLastNavigationItemText.value,
        description: t('foldersAndFiles'),
      });
    }

    const FILE_TYPE_TO_DESCRIPTION = {
      [FILE_TYPES.AUDIO]: t('listenToAudio', { fileName: maybeLinkedFile.value.name }),
      [FILE_TYPES.IMAGE]: t('watchTheImage', { fileName: maybeLinkedFile.value.name }),
      [FILE_TYPES.VIDEO]: t('watchTheVideo', { fileName: maybeLinkedFile.value.name }),
    };

    return t('thatsWhatCloseToMe', {
      folderName: maybeLastNavigationItemText.value,
      description: FILE_TYPE_TO_DESCRIPTION[maybeLinkedFile.value.fileType],
    });
  },
});

onBeforeRouteUpdate((to) => void fetchData(to));
</script>

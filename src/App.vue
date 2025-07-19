<template>
  <Suspense>
    <div class="flex flex-col bg-background h-[100dvh] overflow-hidden">
      <TheHeader />
      <main :id="MAIN" class="[scrollbar-gutter:stable_both-edges] relative overflow-y-auto flex flex-col flex-1">
        <RouterView />
        <LazyTheToasts v-if="toastsStore.hasToasts" class="sticky bottom-4 mx-auto" />
        <TheDialogGallery />
      </main>
      <LazyThePlayer v-if="playerStore.isTrackLoaded" />
      <LazyTheFooter v-else />
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { defineAsyncComponent, onServerPrefetch, useSSRContext } from 'vue';

import { usePlayerStore } from '@/stores/player';
import { useToastsStore } from '@/stores/toasts';
import TheHeader from '@/components/TheHeader';
import TheDialogGallery from '@/components/TheDialogGallery.vue';
import { MAIN } from '@/constants/selectors';
import { useSettingsStore } from '@/stores/settings';
import { themeColorToThemeColorClass } from '@/helpers/themeColor';
import { isServer } from '@/constants/target';
import { nonNullable } from '@/utils/nonNullable';
import { useExplorerStore } from '@/stores/explorer';
import { useRoute } from 'vue-router';
import { RouteName } from './router';
import { clientOnly } from './helpers/clientOnly';

const LazyThePlayer = defineAsyncComponent(() => import('@/components/ThePlayer'));
const LazyTheToasts = defineAsyncComponent(() => import('@/components/TheToasts.vue'));
const LazyTheFooter = defineAsyncComponent(() => import('@/components/TheFooter'));

const route = useRoute();

const playerStore = usePlayerStore();
const toastsStore = useToastsStore();

if (isServer) {
  const ssrContext = nonNullable(useSSRContext());
  const settingsStore = useSettingsStore();

  settingsStore.initSettings(ssrContext.request.locals.settings);

  useHead({
    title: String(import.meta.env.VITE_SITE_TITLE),
    bodyAttrs: {
      class: themeColorToThemeColorClass(settingsStore.settings.themeColor),
    },
  });
}

if (route.name === RouteName.Explorer) {
  const explorerStore = useExplorerStore();

  const getFolderData = () => explorerStore.getFolderData(route);

  onServerPrefetch(getFolderData);
  clientOnly(getFolderData);
}
</script>

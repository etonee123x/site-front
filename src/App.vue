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
      <TheFooter v-else />
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { defineAsyncComponent, useSSRContext } from 'vue';

import { usePlayerStore } from '@/stores/player';
import { useToastsStore } from '@/stores/toasts';
import TheHeader from '@/components/TheHeader';
import TheFooter from '@/components/TheFooter';
import TheDialogGallery from '@/components/TheDialogGallery.vue';
import { MAIN } from '@/constants/selectors';
import { useSettingsStore } from '@/stores/settings';
import { throwError } from '@etonee123x/shared/utils/throwError';
import { themeColorToThemeColorClass } from '@/helpers/themeColor';

const LazyThePlayer = defineAsyncComponent(() => import('@/components/ThePlayer'));
const LazyTheToasts = defineAsyncComponent(() => import('@/components/TheToasts.vue'));

const playerStore = usePlayerStore();
const toastsStore = useToastsStore();

const settingsStore = useSettingsStore();

if (import.meta.env.SSR) {
  const ssrContext = useSSRContext() ?? throwError();

  settingsStore.initSettings(ssrContext.settings);

  useHead({
    title: String(import.meta.env.VITE_SITE_TITLE),
    bodyAttrs: {
      class: themeColorToThemeColorClass(settingsStore.settings.themeColor),
    },
  });
}
</script>

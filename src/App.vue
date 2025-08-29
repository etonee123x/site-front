<template>
  <Suspense>
    <div class="flex flex-col bg-background h-[100dvh] overflow-hidden">
      <TheHeader />
      <main :id="MAIN" class="[scrollbar-gutter:stable_both-edges] relative overflow-y-auto flex flex-col flex-1">
        <RouterView />
        <LazyTheToasts v-if="toastsStore.hasToasts" class="sticky bottom-4 mx-auto" />
      </main>
      <LazyThePlayer v-if="playerStore.isTrackLoaded" />
      <LazyTheFooter v-else />
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { defineAsyncComponent, onServerPrefetch } from 'vue';

import { usePlayerStore } from '@/stores/player';
import { useToastsStore } from '@/stores/toasts';
import TheHeader from '@/components/TheHeader';
import { MAIN } from '@/constants/selectors';
import { useSettingsStore } from '@/stores/settings';
import { themeColorToThemeColorClass } from '@/helpers/themeColor';
import { isServer } from '@/constants/target';
import { nonNullable } from '@/utils/nonNullable';
import { useExplorerStore } from '@/stores/explorer';
import { useRoute } from 'vue-router';
import { RouteName } from '@/router';
import { clientOnly } from '@/helpers/clientOnly';
import { i18n } from '@/i18n';
import { isNotNil } from '@etonee123x/shared/utils/isNotNil';
import { useGoToPage404 } from '@/composables/useGoToPage404';
import { useSSRContext } from '@/composables/useSSRContext';

const LazyThePlayer = defineAsyncComponent(() => import('@/components/ThePlayer'));
const LazyTheToasts = defineAsyncComponent(() => import('@/components/TheToasts.vue'));
const LazyTheFooter = defineAsyncComponent(() => import('@/components/TheFooter'));

const route = useRoute();

const goToPage404 = useGoToPage404();

const playerStore = usePlayerStore();
const toastsStore = useToastsStore();

if (isServer) {
  const ssrContext = nonNullable(useSSRContext());

  const maybeSettings = ssrContext.express.request.locals?.settings;

  const settingsStore = useSettingsStore();

  if (maybeSettings) {
    settingsStore.initSettings(maybeSettings);
  }

  useHead({
    bodyAttrs: {
      class: themeColorToThemeColorClass(settingsStore.settings.themeColor),
    },
  });
}

if (route.name === RouteName.Explorer) {
  const explorerStore = useExplorerStore();

  const getFolderData = () => explorerStore.getFolderData(route).catch(goToPage404);

  onServerPrefetch(getFolderData);
  clientOnly(getFolderData);
}

useHead({
  titleTemplate: (title) =>
    [
      ...(isNotNil(title)
        ? [
            //
            title,
          ]
        : []),
      String(import.meta.env.VITE_SITE_TITLE),
    ].join(' | '),
  htmlAttrs: {
    lang: () => i18n.global.locale.value.toLocaleLowerCase(),
  },
});
</script>

<template>
  <div class="flex flex-col bg-background h-[100dvh] overflow-hidden">
    <TheHeader />
    <main class="[scrollbar-gutter:stable_both-edges] relative overflow-y-auto flex flex-col flex-1" ref="refMain">
      <RouterView />
      <LazyTheToasts v-if="toastsStore.hasToasts" />
      <TheDialogGallery />
    </main>
    <LazyThePlayer v-if="playerStore.isTrackLoaded" ref="refThePlayer" />
    <TheFooter v-else />
  </div>
</template>

<script setup lang="ts">
import { useTitle } from '@vueuse/core';
import { defineAsyncComponent, ref, watch } from 'vue';

import { usePlayerStore } from '@/stores/player';
import { useToastsStore } from '@/stores/toasts';
import { useComponentsStore } from '@/stores/components';
import TheHeader from '@/components/TheHeader';
import TheFooter from '@/components/TheFooter';
import TheDialogGallery from '@/components/TheDialogGallery.vue';

const LazyThePlayer = defineAsyncComponent(() => import('@/components/ThePlayer'));
const LazyTheToasts = defineAsyncComponent(() => import('@/components/TheToasts.vue'));

const playerStore = usePlayerStore();

const toastsStore = useToastsStore();

const componentsStore = useComponentsStore();

useTitle(String(import.meta.env.VITE_SITE_TITLE));

const refThePlayer = ref(null);
const refMain = ref(null);

watch(refThePlayer, (v) => {
  componentsStore.thePlayer = v;
});

watch(refMain, (v) => {
  componentsStore.main = v;
});
</script>

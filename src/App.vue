<template>
  <div class="flex flex-col bg-background h-screen overflow-hidden">
    <TheHeader />
    <main ref="refMain" class="[scrollbar-gutter:stable_both-edges] relative overflow-y-auto flex flex-col flex-1">
      <RouterView />
      <LazyTheToasts v-if="hasToasts" />
      <LazyTheGallery v-if="isImageLoaded" />
    </main>
    <LazyThePlayer v-if="isTrackLoaded" ref="refThePlayer" />
    <TheFooter v-else />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';

import { useGalleryStore } from '@/stores/gallery';
import { usePlayerStore } from '@/stores/player';
import { useToastsStore } from '@/stores/toasts';
import { useComponentsStore } from '@/stores/components';
import TheHeader from '@/components/TheHeader';
import TheFooter from '@/components/TheFooter';

const LazyThePlayer = defineAsyncComponent(() => import('@/components/ThePlayer'));
const LazyTheGallery = defineAsyncComponent(() => import('@/components/TheGallery.vue'));
const LazyTheToasts = defineAsyncComponent(() => import('@/components/TheToasts.vue'));

const playerStore = usePlayerStore();
const { isTrackLoaded } = storeToRefs(playerStore);

const galleryStore = useGalleryStore();
const { isImageLoaded } = storeToRefs(galleryStore);

const toastsStore = useToastsStore();
const { hasToasts } = storeToRefs(toastsStore);

const componentsStore = useComponentsStore();
const { thePlayer, main } = storeToRefs(componentsStore);

const refThePlayer: typeof thePlayer = ref(null);
const refMain: typeof main = ref(null);

watch(refThePlayer, (v) => {
  thePlayer.value = v;
});

watch(refMain, (v) => {
  main.value = v;
});
</script>

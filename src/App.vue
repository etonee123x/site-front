<template>
  <div :class="$style.app">
    <TheHeader />
    <main :class="$style.main">
      <RouterView class="l-container" />
      <LazyTheToasts v-if="hasToasts" />
      <LazyTheGallery v-if="isImageLoaded" />
    </main>
    <LazyThePlayer v-if="isTrackLoaded" :class="$style.player" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';

import { usePlayerStore } from '@/stores/player';
import { useGalleryStore } from '@/stores/gallery';
import { useToastsStore } from '@/stores/toasts';

import TheHeader from '@/components/TheHeader.vue';

const LazyThePlayer = defineAsyncComponent(() => import('@/components/ThePlayer.vue'));
const LazyTheGallery = defineAsyncComponent(() => import('@/components/TheGallery.vue'));
const LazyTheToasts = defineAsyncComponent(() => import('@/components/TheToasts.vue'));

const playerStore = usePlayerStore();
const { isTrackLoaded } = storeToRefs(playerStore);

const galleryStore = useGalleryStore();
const { isImageLoaded } = storeToRefs(galleryStore);

const toastsStore = useToastsStore();
const { hasToasts } = storeToRefs(toastsStore);
</script>

<style module lang="scss">
.app {
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
  height: 100vh;
}

.main {
  position: relative;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  flex: 1;
  scrollbar-gutter: stable both-edges;
}

.player {
  position: sticky;
  bottom: 0;
  margin-top: auto;
}
</style>

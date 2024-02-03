<template>
  <div :class="$style.app">
    <TheHeader />
    <main :class="$style.main">
      <RouterView class="l-container" />
      <TheToasts />
      <TheGallery />
    </main>
    <LazyThePlayer v-if="isTrackLoaded" :class="$style.player" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';

import { usePlayerStore } from '@/stores/player';

import TheHeader from '@/components/TheHeader.vue';
import TheToasts from '@/components/TheToasts.vue';
import TheGallery from '@/components/TheGallery.vue';

const LazyThePlayer = defineAsyncComponent(() => import('@/components/ThePlayer.vue'));

const playerStore = usePlayerStore();
const { isTrackLoaded } = storeToRefs(playerStore);
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

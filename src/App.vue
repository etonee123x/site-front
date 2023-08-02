<template>
  <div class="app">
    <TheHeader class="app__header" />
    <main class="app__main">
      <div class="app__container l-container">
        <router-view class="app__content" />
      </div>
      <ThePlayer
        v-if="isTrackLoaded"
        class="app__player"
      />
      <TheToasts />
      <TheGallery />
    </main>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { usePlayerStore } from '@/stores/player';
import { useSettingsStore } from '@/stores/settings';

import ThePlayer from '@/components/ThePlayer.vue';
import TheHeader from '@/components/TheHeader.vue';
import TheToasts from '@/components/TheToasts.vue';
import TheGallery from '@/components/TheGallery.vue';

const { isTrackLoaded } = storeToRefs(usePlayerStore());

useSettingsStore().initSettings();
</script>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
  height: 100vh;

  &__main {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    flex: 1;
    scrollbar-gutter: stable both-edges;
  }

  &__player {
    position: sticky;
    bottom: 0;
    margin-top: auto;
  }

  &__toasts {
    position: fixed;
    top: 0.5rem;
    left: 0;
    right: 0;
  }
}
</style>

<template>
  <div class="app">
    <div class="app__container l-container">
      <TheHeader class="app_header" />
      <router-view class="app__content" />
    </div>
    <ThePlayer
      v-if="isTrackLoaded"
      class="app__player"
    />
    <TheToasts />
    <TheGallery />
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/player';
import { storeToRefs } from 'pinia';

import ThePlayer from '@/components/ThePlayer.vue';
import TheHeader from '@/components/TheHeader.vue';
import TheToasts from '@/components/TheToasts.vue';
import TheGallery from '@/components/TheGallery.vue';

const { isTrackLoaded } = storeToRefs(usePlayerStore());
</script>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  background-color: $color-bg;
  min-height: 100vh;

  &__content {
    padding: 0.5rem 0;
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

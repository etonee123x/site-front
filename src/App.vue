<template>
  <div class="app">
    <TheHeader class="app_header" />
    <router-view class="app__content" />
    <ThePlayer class="app__player" />
  </div>
</template>

<script setup lang="ts">
import ThePlayer from '@/components/ThePlayer.vue';
import TheHeader from '@/components/TheHeader.vue';
</script>

<style scoped lang="scss">
.app {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: $color-bg;

  &__content {
    padding: 0.5rem 0;
  }

  &__player {
    width: 100%;
    position: sticky;
    bottom: 0;
  }
}
</style>

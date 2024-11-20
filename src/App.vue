<template>
  <div class="flex flex-col bg-background h-[100dvh] overflow-hidden">
    <TheHeader />
    <main
      :id="MAIN"
      class="[scrollbar-gutter:stable_both-edges] relative overflow-y-auto flex flex-col flex-1"
      ref="templateMain"
    >
      <RouterView />
      <LazyTheToasts v-if="toastsStore.hasToasts" class="sticky bottom-4 mx-auto" />
      <TheDialogGallery />
    </main>
    <LazyThePlayer v-if="playerStore.isTrackLoaded" ref="templateThePlayer" />
    <TheFooter v-else />
  </div>
</template>

<script setup lang="ts">
import { useTitle } from '@vueuse/core';
import { defineAsyncComponent, useTemplateRef } from 'vue';

import { usePlayerStore } from '@/stores/player';
import { useToastsStore } from '@/stores/toasts';
import TheHeader from '@/components/TheHeader';
import TheFooter from '@/components/TheFooter';
import TheDialogGallery from '@/components/TheDialogGallery.vue';
import { MAIN } from '@/constants/selectors';

const LazyThePlayer = defineAsyncComponent(() => import('@/components/ThePlayer'));
const LazyTheToasts = defineAsyncComponent(() => import('@/components/TheToasts.vue'));

const playerStore = usePlayerStore();

const toastsStore = useToastsStore();

useTitle(String(import.meta.env.VITE_SITE_TITLE));

const templateThePlayer = useTemplateRef('templateThePlayer');
const templateMain = useTemplateRef('templateMain');
</script>

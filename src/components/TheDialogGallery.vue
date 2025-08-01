<template>
  <BaseDialog isHiddenFooter isHiddenHeader ref="baseDialog" @close="onClose">
    <article v-if="galleryStore.galleryItem" class="flex flex-col gap-2 items-center flex-1 w-full h-full">
      <header class="contents">
        <BaseAlwaysScrollable class="w-full [--base-always-scrollable--content--margin:0_auto]" duration="12000">
          {{ galleryStore.galleryItem.name }}
        </BaseAlwaysScrollable>
      </header>
      <div class="flex-1 flex items-center justify-center overflow-hidden w-full h-full" ref="mediaContainer">
        <component
          :is="component.is"
          v-bind="component.binds"
          class="object-contain border-none max-w-full max-h-[calc(90dvh_-2*4*var(--spacing)_-6*var(--spacing)_-2*var(--spacing))]"
          :src="galleryStore.galleryItem.src"
        />
      </div>
    </article>
  </BaseDialog>
</template>

<script lang="ts" setup>
import { onKeyStroke, useSwipe, whenever } from '@vueuse/core';
import { computed, useTemplateRef } from 'vue';

import BaseAlwaysScrollable from '@/components/ui/BaseAlwaysScrollable.vue';
import BaseDialog from '@/components/ui/BaseDialog.vue';
import { useGalleryStore } from '@/stores/gallery';

const galleryStore = useGalleryStore();

const baseDialog = useTemplateRef('baseDialog');

onKeyStroke('ArrowRight', () => galleryStore.next());
onKeyStroke('ArrowLeft', () => galleryStore.prev());

const mediaContainer = useTemplateRef('mediaContainer');

const component = computed(() =>
  galleryStore.isCurrentGalleryItemVideo
    ? {
        is: 'video',
        binds: {
          controls: true,
        },
      }
    : {
        is: 'img',
      },
);

useSwipe(mediaContainer, {
  onSwipeEnd: (...[, direction]) => {
    if (direction === 'right') {
      return galleryStore.prev();
    }

    if (direction === 'left') {
      return galleryStore.next();
    }
  },
});

const onClose = galleryStore.unloadGalleryItem;

whenever(
  () => galleryStore.isGalleryItemLoaded,
  () => baseDialog.value?.open(),
);
</script>

<template>
  <BaseDialog
    ref="refBaseDialog"
    style="width: 90%; max-width: 90%; height: 90%; max-height: 90%; overflow: hidden"
    is-hidden-footer
    is-hidden-header
    @close="onClose"
  >
    <div v-if="galleryItem" class="flex flex-col gap-2 items-center flex-1 w-full h-full">
      <BaseAlwaysScrollable class="mb-1 w-full [--base-always-scrollable--content--margin:0_auto]" duration="12000">
        {{ galleryItem.name }}
      </BaseAlwaysScrollable>
      <div ref="refMediaContainer" class="flex-1 flex items-center justify-center overflow-hidden w-full h-full">
        <component
          :is="component.is"
          v-bind="component.binds"
          class="h-full object-contain outline-none border-none"
          :src="galleryItem.src"
        />
      </div>
    </div>
  </BaseDialog>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { onKeyStroke, useSwipe, whenever } from '@vueuse/core';
import { ref, computed } from 'vue';

import BaseAlwaysScrollable from '@/components/ui/BaseAlwaysScrollable.vue';
import BaseDialog from '@/components/ui/BaseDialog.vue';
import { useGalleryStore } from '@/stores/gallery';

const galleryStore = useGalleryStore();
const { galleryItem, isCurrentGalleryItemVideo, isGalleryItemLoaded } = storeToRefs(galleryStore);
const { next, prev, unloadGalleryItem } = galleryStore;

const refBaseDialog = ref<InstanceType<typeof BaseDialog>>();

onKeyStroke('ArrowRight', () => next());
onKeyStroke('ArrowLeft', () => prev());

const refMediaContainer = ref<HTMLDivElement>();

const component = computed(() =>
  isCurrentGalleryItemVideo.value
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

useSwipe(refMediaContainer, {
  onSwipeEnd: (...[, direction]) => {
    if (direction === 'right') {
      return prev();
    }

    if (direction === 'left') {
      return next();
    }
  },
});

const onClose = unloadGalleryItem;

whenever(isGalleryItemLoaded, () => refBaseDialog.value?.open());
</script>

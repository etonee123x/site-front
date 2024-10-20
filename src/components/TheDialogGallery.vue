<template>
  <BaseDialog
    style="width: 90%; max-width: 90%; height: 90%; max-height: 90%; overflow: hidden"
    isHiddenFooter
    isHiddenHeader
    ref="refBaseDialog"
    @close="onClose"
  >
    <div v-if="galleryStore.galleryItem" class="flex flex-col gap-2 items-center flex-1 w-full h-full">
      <BaseAlwaysScrollable class="mb-1 w-full [--base-always-scrollable--content--margin:0_auto]" duration="12000">
        {{ galleryStore.galleryItem.name }}
      </BaseAlwaysScrollable>
      <div class="flex-1 flex items-center justify-center overflow-hidden w-full h-full" ref="refMediaContainer">
        <component
          :is="component.is"
          v-bind="component.binds"
          class="h-full object-contain outline-none border-none"
          :src="galleryStore.galleryItem.src"
        />
      </div>
    </div>
  </BaseDialog>
</template>

<script lang="ts" setup>
import { onKeyStroke, useSwipe, whenever } from '@vueuse/core';
import { ref, computed } from 'vue';

import BaseAlwaysScrollable from '@/components/ui/BaseAlwaysScrollable.vue';
import BaseDialog from '@/components/ui/BaseDialog.vue';
import { useGalleryStore } from '@/stores/gallery';

const galleryStore = useGalleryStore();

const refBaseDialog = ref<InstanceType<typeof BaseDialog>>();

onKeyStroke('ArrowRight', () => galleryStore.next());
onKeyStroke('ArrowLeft', () => galleryStore.prev());

const refMediaContainer = ref<HTMLDivElement>();

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

useSwipe(refMediaContainer, {
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
  () => refBaseDialog.value?.open(),
);
</script>

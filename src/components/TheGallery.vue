<template>
  <div
    v-if="galleryItem"
    ref="refMediaContainer"
    :style="fullStyles"
    class="touch-pinch-zoom fixed bg-background p-2 border-2 border-dark flex gap-2 items-center"
  >
    <BaseButton :prepend-icon-path="mdiChevronLeft" class="h-10" @click="() => prev()" />
    <div>
      <div class="text-center mb-1">
        {{ galleryItem.name }}
      </div>
      <img
        ref="refMedia"
        class="mx-auto block"
        :draggable="false"
        :src="galleryItem.src"
        @load="onImgLoad"
        @wheel.prevent="onWheel"
      />
    </div>
    <BaseButton :prepend-icon-path="mdiChevronRight" class="h-10" @click="() => next()" />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref, computed, watch } from 'vue';
import { onClickOutside, useDraggable, useToggle, onKeyStroke } from '@vueuse/core';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';

import { useGalleryStore } from '@/stores/gallery';
import { useComponentsStore } from '@/stores/components';
import BaseButton from '@/components/ui/BaseButton.vue';

const galleryStore = useGalleryStore();
const { galleryItem } = storeToRefs(galleryStore);
const { next, prev } = galleryStore;

const componentsStore = useComponentsStore();
const { playerHeight } = storeToRefs(componentsStore);

const refMediaContainer = ref<HTMLDivElement>();
const refMedia = ref<HTMLImageElement>();
const [isMediaVisible, setIsMediaVisible] = useToggle();

onClickOutside(refMediaContainer, galleryStore.unloadGalleryItem);
const { x, y, style } = useDraggable(refMediaContainer, { preventDefault: true, stopPropagation: true });

const fullStyles = computed(() => [style.value, { opacity: Number(isMediaVisible.value) }]);

const withPx = (value: number | string) => `${value}px`;

const woPx = (value: string) => {
  const result = Number(value.replace('px', ''));
  return Number.isNaN(result) ? undefined : result;
};

const onImgLoad = () => {
  if (!refMedia.value || !refMediaContainer.value) {
    return;
  }

  const MEDIA_OVER_SCREEN_SIZE = 0.9;

  const freeSpace = {
    height: window.innerHeight - playerHeight.value,
    width: document.body.clientWidth,
  };

  const maxSafeFreeSpace = {
    height: Math.floor(freeSpace.height * MEDIA_OVER_SCREEN_SIZE),
    width: Math.floor(freeSpace.width * MEDIA_OVER_SCREEN_SIZE),
  };

  const windowToImageScaleFactors = {
    height: refMedia.value.clientHeight / maxSafeFreeSpace.height,
    width: refMedia.value.clientWidth / maxSafeFreeSpace.width,
  };

  const imageAspectRatio = refMedia.value.clientWidth / refMedia.value.clientHeight;

  if (windowToImageScaleFactors.height > 1 || windowToImageScaleFactors.width > 1) {
    if (windowToImageScaleFactors.height > windowToImageScaleFactors.width) {
      refMedia.value.style.height = withPx(maxSafeFreeSpace.height);
      refMedia.value.style.width = withPx(Math.floor(refMedia.value.clientHeight * imageAspectRatio));
    } else {
      refMedia.value.style.width = withPx(maxSafeFreeSpace.width);
      refMedia.value.style.height = withPx(Math.floor(refMedia.value.clientWidth / imageAspectRatio));
    }
  }

  const newSizes = { width: refMediaContainer.value.offsetWidth, height: refMediaContainer.value.offsetHeight };

  x.value = Math.floor(freeSpace.width - newSizes.width) / 2;
  y.value = Math.floor(freeSpace.height - newSizes.height) / 2;

  setIsMediaVisible(true);
};

const onWheel = (e: WheelEvent) => {
  if (!(refMedia.value && refMediaContainer.value)) {
    return;
  }

  const SCALE_FACTOR = 1.15;

  const { left, top } = refMedia.value.getBoundingClientRect();

  const isZoomingIn = e.deltaY < 0;

  const multiplier = isZoomingIn ? SCALE_FACTOR - 1 : 1 / SCALE_FACTOR - 1;

  refMedia.value.style.width = isZoomingIn
    ? withPx(refMedia.value.clientWidth * SCALE_FACTOR)
    : withPx(refMedia.value.clientWidth / SCALE_FACTOR);

  refMedia.value.style.height = 'auto';

  refMediaContainer.value.style.left = withPx(
    (woPx(refMediaContainer.value.style.left) ?? 0) - (e.clientX - left) * multiplier,
  );

  refMediaContainer.value.style.top = withPx(
    (woPx(refMediaContainer.value.style.top) ?? 0) - (e.clientY - top) * multiplier,
  );
};

onKeyStroke('ArrowRight', () => next());
onKeyStroke('ArrowLeft', () => prev());

watch(galleryItem, () => {
  if (galleryItem.value) {
    return;
  }

  setIsMediaVisible(false);
});
</script>

<template>
  <div v-if="theImage">
    <div ref="refMediaContainer" :style="fullStyles" :class="$style.mediaContainer">
      <div :class="$style.mediaInfo">
        {{ theImage.name }}
      </div>
      <img
        ref="refMedia"
        :class="$style.theMedia"
        :draggable="false"
        :src="theImage.src"
        @load="onImgLoad"
        @wheel.prevent="onWheel"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref, computed, watch } from 'vue';
import { onClickOutside, useDraggable, useToggle } from '@vueuse/core';

import { useGalleryStore, useComponentsStore } from '@/stores';

const galleryStore = useGalleryStore();
const { theImage } = storeToRefs(galleryStore);

const componentsStore = useComponentsStore();
const { playerHeight } = storeToRefs(componentsStore);

const refMediaContainer = ref<HTMLDivElement>();
const refMedia = ref<HTMLImageElement>();
const [isMediaVisible, setIsMediaVisible] = useToggle();

onClickOutside(refMediaContainer, galleryStore.unloadImage);
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

watch(theImage, () => {
  if (theImage.value) {
    return;
  }

  setIsMediaVisible(false);
});
</script>

<style lang="scss" module>
.mediaContainer {
  touch-action: pinch-zoom;
  position: fixed;
  background-color: var(--color-items);
  padding: 0.5rem;
  border: 2px var(--color-dark) solid;
}

.mediaInfo {
  text-align: center;
  margin-bottom: 0.25rem;
}

.theMedia {
  margin: 0 auto;
  display: block;
}
</style>

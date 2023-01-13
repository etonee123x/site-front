<template>
  <div v-if="theImg" class="gallery">
    <div ref="mediaContainer" :style="fullStyles" class="gallery__media-container">
      <p class="gallery__media-info">{{ theImg.name }}</p>
      <img
        ref="theMedia"
        class="gallery__the-media"
        :draggable="false"
        :src="theImg.src"
        @load="onImgLoad"
        @wheel="onWheel"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useGalleryStore } from '@/stores/gallery';
import { storeToRefs } from 'pinia';
import { ref, computed, watch } from 'vue';
import { onClickOutside, useDraggable } from '@vueuse/core';

const galleryStore = useGalleryStore();
const { theImg } = storeToRefs(galleryStore);

const mediaContainer = ref<HTMLDivElement | null>(null);
const theMedia = ref<HTMLImageElement | null>(null);
const isMediaVisible = ref(false);

onClickOutside(mediaContainer, galleryStore.removeImage);
const { x, y, style } = useDraggable(mediaContainer);

const fullStyles = computed(() => [style.value, { opacity: Number(isMediaVisible.value) }]);

watch(theImg, () => {
  if (!theImg.value) {
    isMediaVisible.value = false;
  }
});

const withPx = (value: number | string) => `${value}px`;
const woPx = (value: string) => {
  const result = Number(value.replace('px', ''));
  return Number.isNaN(result) ? undefined : result;
};

const onImgLoad = () => {
  if (!theMedia.value || !mediaContainer.value) {
    return;
  }

  const MEDIA_OVER_SCREEN_SIZE = 0.9;

  const freeSpace = {
    height: window.innerHeight - (document.getElementById('the-player')?.clientHeight ?? 0),
    width: document.body.clientWidth,
  };
  const maxSafeFreeSpace = {
    height: Math.floor(freeSpace.height * MEDIA_OVER_SCREEN_SIZE),
    width: Math.floor(freeSpace.width * MEDIA_OVER_SCREEN_SIZE),
  };
  const windowToImageScaleFactors = {
    height: theMedia.value.clientHeight / maxSafeFreeSpace.height,
    width: theMedia.value.clientWidth / maxSafeFreeSpace.width,
  };
  const imageAspectRatio = theMedia.value.clientWidth / theMedia.value.clientHeight;
  if (windowToImageScaleFactors.height > 1 || windowToImageScaleFactors.width > 1) {
    if (windowToImageScaleFactors.height > windowToImageScaleFactors.width) {
      theMedia.value.style.height = withPx(maxSafeFreeSpace.height);
      theMedia.value.style.width = withPx(Math.floor(theMedia.value.clientHeight * imageAspectRatio));
    } else {
      theMedia.value.style.width = withPx(maxSafeFreeSpace.width);
      theMedia.value.style.height = withPx(Math.floor(theMedia.value.clientWidth / imageAspectRatio));
    }
  }
  const newSizes = { width: mediaContainer.value.offsetWidth, height: mediaContainer.value.offsetHeight };
  x.value = Math.floor(freeSpace.width - newSizes.width) / 2;
  y.value = Math.floor(freeSpace.height - newSizes.height) / 2;
  isMediaVisible.value = true;
};

const onWheel = (e: WheelEvent) => {
  e.preventDefault();
  if (!theMedia.value || !mediaContainer.value || !e.target) {
    return;
  }
  const theImageRect = theMedia.value?.getBoundingClientRect();

  const SCALE_FACTOR = 1.15;

  const isZoomingIn = e.deltaY < 0;

  const multiplier = isZoomingIn ? SCALE_FACTOR - 1 : 1 / SCALE_FACTOR - 1;

  theMedia.value.style.width = isZoomingIn
    ? withPx(theMedia.value.clientWidth * SCALE_FACTOR)
    : withPx(theMedia.value.clientWidth / SCALE_FACTOR);
  theMedia.value.style.height = 'auto';

  mediaContainer.value.style.left = withPx(
    (woPx(mediaContainer.value.style.left) ?? 0) - (e.clientX - theImageRect.left) * multiplier,
  );
  mediaContainer.value.style.top = withPx(
    (woPx(mediaContainer.value.style.top) ?? 0) - (e.clientY - theImageRect.top) * multiplier,
  );
};
</script>

<style lang="scss" scoped>
.gallery {
  &__media-container {
    position: fixed;
    background-color: $color-items;
    padding: 0.5rem;
    border: 2px $color-dark solid;
  }
  &__media-info {
    text-align: center;
    margin-bottom: 0.25rem;
  }
  &__the-media {
    display: block;
  }
}
</style>

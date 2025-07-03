<template>
  <div :style ref="root" @touchstart="onTouchStart" @touchmove.prevent="onTouchMove" @touchend="onTouchEnd">
    <slot />
  </div>
</template>

<script setup lang="ts">
// TODO: переписать на useSwipe?...
import { type CSSProperties, reactive, computed, useTemplateRef } from 'vue';
import { useElementSize } from '@vueuse/core';

const props = withDefaults(
  defineProps<
    Partial<{
      threshold: number | `${number}`;
      disapearDelay: number | `${number}`;
    }>
  >(),
  {
    threshold: 0.25,
    disapearDelay: 300,
  },
);

const emit = defineEmits<{
  swiped: [];
}>();

const root = useTemplateRef('root');

const { width } = useElementSize(root, undefined, { box: 'border-box' });

const threshold = computed(() => width.value * Number(props.threshold));

let touchStartX = 0;
let diff = 0;
let wasStarted = false;

const style = reactive<CSSProperties>({});

const onTouchStart = (e: TouchEvent) => {
  const maybeChangedTouch = e.changedTouches[0];

  if (!maybeChangedTouch) {
    return;
  }

  wasStarted = true;
  touchStartX = maybeChangedTouch.screenX;
  style.transition = 'all 0ms';
};

const onTouchMove = (e: TouchEvent) => {
  const maybeTouch = e.touches[0];

  if (!(wasStarted && maybeTouch)) {
    return;
  }

  diff = maybeTouch.screenX - touchStartX;
  style.transform = `translateX(${diff}px)`;
};

const onTouchEnd = () => {
  wasStarted = false;

  const wasSwipedLeft = diff < -threshold.value;
  const wasSwipedRight = diff > threshold.value;

  if (!(wasSwipedLeft || wasSwipedRight)) {
    style.transition = 'all 500ms';
    style.transform = `translateX(0px)`;

    return;
  }

  style.transition = `all ${props.disapearDelay}ms`;
  style.transform = `translateX(${globalThis.innerWidth * (wasSwipedLeft ? -1 : 1)}px)`;

  setTimeout(() => emit('swiped'), Number(props.disapearDelay));
};
</script>

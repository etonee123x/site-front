<template>
  <div
    ref="refElement"
    :style="style"
    @touchstart="onTouchStart"
    @touchmove.prevent="onTouchMove"
    @touchend="onTouchEnd"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { type CSSProperties, reactive, ref, computed } from 'vue';
import { useElementSize } from '@vueuse/core';
import { isTruthy } from '@shared/src/utils';

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

const refElement = ref<HTMLDivElement>();

const { width } = useElementSize(refElement, undefined, { box: 'border-box' });

const threshold = computed(() => width.value * Number(props.threshold));

let touchStartX = 0;
let diff = 0;
let wasStarted = false;

const style = reactive<CSSProperties>({});

const onTouchStart = (e: TouchEvent) => {
  wasStarted = true;
  touchStartX = e.changedTouches[0].screenX;
  style.transition = 'all 0ms';
};

const onTouchMove = (e: TouchEvent) => {
  if (!wasStarted) {
    return;
  }

  diff = e.touches[0].screenX - touchStartX;
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
  style.transform = `translateX(${[wasSwipedLeft && '-', window.innerWidth].filter(isTruthy).join('')}px)`;

  setTimeout(() => emit('swiped'), Number(props.disapearDelay));
};
</script>

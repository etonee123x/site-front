<template>
  <div
    tabindex="0"
    class="w-full py-0.5 cursor-pointer"
    ref="slider"
    @pointerdown.stop
    @dragstart.stop
    @mousedown.stop
    @touchstart.stop
  >
    <div
      :style
      class="bg-details-75 h-1 relative after:absolute after:bg-details-500 after:h-full after:w-[var(--width)]"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useMousePressed, useMouseInElement, promiseTimeout, useToggle } from '@vueuse/core';

import { to0To1Borders } from '@/utils/to0To1Borders';

const props = withDefaults(
  defineProps<{
    modelValue: number;
    multiplier?: number;
    isLazy?: boolean;
  }>(),
  {
    multiplier: 1,
  },
);

const position = ref(0);
const [isUsingPosition, setIsUsingPosition] = useToggle();

const model = defineModel<number>();

const style = computed(() => ({
  '--width': `${Number(((isUsingPosition.value ? position.value : props.modelValue) * 100) / props.multiplier).toFixed(2)}%`,
}));

const slider = useTemplateRef('slider');

const { pressed: isPressed } = useMousePressed({ target: slider });
const { elementWidth, elementX } = useMouseInElement(slider);

watch(isPressed, () => (props.isLazy ? onIsPressedChangeLazy() : onIsPressedChange()));

const getPosition = () =>
  promiseTimeout(0).then(() => to0To1Borders(elementX.value, [, elementWidth.value]) * props.multiplier);

const onIsPressedChange = async () => {
  if (!isPressed.value) {
    return;
  }

  getPosition().then((position) => {
    model.value = position;

    onIsPressedChange();
  });
};

const onIsPressedChangeLazy = async () => {
  if (!isPressed.value) {
    model.value = position.value;
    setIsUsingPosition(false);

    return;
  }

  setIsUsingPosition(true);

  getPosition().then((_position) => {
    position.value = _position;

    onIsPressedChangeLazy();
  });
};
</script>

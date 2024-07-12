<template>
  <div
    ref="refSlider"
    tabindex="0"
    class="w-full py-0.5 cursor-pointer focus:on-focus focus:outline-2"
    @pointerdown.stop
    @dragstart.stop
    @mousedown.stop
    @touchstart.stop
  >
    <div class="bg-[rgb(from_var(--color-details-500)_r_g_b_/_0.25)]">
      <div class="h-1 bg-details-500" :style="style" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useMousePressed, useMouseInElement, promiseTimeout, useToggle } from '@vueuse/core';

import { to0To1Borders } from '@/utils';

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
  width: `${Number(((isUsingPosition.value ? position.value : props.modelValue) * 100) / props.multiplier).toFixed(2)}%`,
}));

const refSlider = ref<HTMLDivElement>();

const { pressed: isPressed } = useMousePressed({ target: refSlider });
const { elementWidth, elementX } = useMouseInElement(refSlider);

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

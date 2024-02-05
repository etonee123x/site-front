<template>
  <div ref="refSlider" :class="$style.wrapper" @pointerdown.stop @dragstart.stop @mousedown.stop @touchstart.stop>
    <div :class="$style.zone">
      <div :class="$style.filler" :style="style" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useMousePressed, useMouseInElement } from '@vueuse/core';

import { to0To1Borders } from '@/utils';

const props = withDefaults(
  defineProps<{
    modelValue: number;
    multiplicator?: number;
    isLazy?: boolean;
  }>(),
  {
    multiplicator: 1,
  },
);

const position = ref(0);
const isUsingPosition = ref(false);

const model = defineModel<number>();

const style = computed(() => ({
  width: `${Number(((isUsingPosition.value ? position.value : props.modelValue) * 100) / props.multiplicator).toFixed(2)}%`,
}));

const refSlider = ref<HTMLDivElement>();

const { pressed: isPressed } = useMousePressed({ target: refSlider });
const { elementWidth, elementX } = useMouseInElement(refSlider);

watch(isPressed, () => (props.isLazy ? onIsPressedChangeLazy() : onIsPressedChange()));

const getPosition = () =>
  new Promise<number>((resolve) =>
    setTimeout(() => resolve(to0To1Borders(elementX.value, [, elementWidth.value]) * props.multiplicator), 0),
  );

const onIsPressedChange = async () => {
  position.value = props.modelValue;

  while (isPressed.value) {
    model.value = await getPosition();
  }
};

const onIsPressedChangeLazy = async () => {
  position.value = props.modelValue;

  if (!isPressed.value) {
    isUsingPosition.value = false;
    return;
  }

  isUsingPosition.value = true;

  while (isPressed.value) {
    position.value = await getPosition();
  }

  model.value = position.value;
};
</script>

<style lang="scss" module>
.wrapper {
  width: 100%;
  padding: 0.25rem 0;
  cursor: pointer;
}

.zone {
  background-color: var(--color-dark);
}

.filler {
  height: 0.25rem;
  background-color: var(--color-details);
}
</style>

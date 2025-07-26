<template>
  <button
    type="button"
    :class="BUTTON.default"
    :disabled="isDisabled"
    @click="onCLick"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @touchstart="onTouchStart"
    @touchEnd="onTouchEnd"
  >
    <span class="flex justify-between items-center gap-1" :class="isLoading && 'opacity-20'">
      <span v-if="$slots.prepend || propsIconPrepend" class="flex">
        <slot name="prepend">
          <BaseIcon v-if="propsIconPrepend" v-bind="propsIconPrepend" />
        </slot>
      </span>
      <slot />
      <span v-if="$slots.append || propsIconAppend" class="flex">
        <slot name="append">
          <BaseIcon v-if="propsIconAppend" v-bind="propsIconAppend" />
        </slot>
      </span>
    </span>
    <LazyBaseLoading v-if="isLoading" class="absolute left-1/2" />
  </button>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import type { Props as PropsIcon } from '@/components/ui/BaseIcon';
import { BUTTON } from '@/helpers/ui';
import BaseIcon from '@/components/ui/BaseIcon';

const LazyBaseLoading = defineAsyncComponent(() => import('@/components/ui/BaseLoading.vue'));

const props = defineProps<
  Partial<{
    isDisabled: boolean;
    isLoading: boolean;
    propsIconPrepend: PropsIcon;
    propsIconAppend: PropsIcon;
  }>
>();

const emit = defineEmits<{
  click: [Event];
  mouseDown: [Event];
  mouseUp: [Event];
  touchStart: [Event];
  touchEnd: [Event];
}>();

const isDisabled = computed(() => props.isDisabled || props.isLoading);

const onCLick = (e: Event) => {
  if (isDisabled.value) {
    return;
  }

  emit('click', e);
};

const onMouseDown: HTMLButtonElement['onmousedown'] = (e) => emit('mouseDown', e);
const onMouseUp: HTMLButtonElement['onmouseup'] = (e) => emit('mouseUp', e);
const onTouchStart: HTMLButtonElement['ontouchstart'] = (e) => emit('touchStart', e);
const onTouchEnd: HTMLButtonElement['ontouchend'] = (e) => emit('touchEnd', e);
</script>

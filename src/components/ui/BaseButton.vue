<template>
  <button type="button" :disabled="isDisabled" @click="onCLick">
    <div class="flex justify-between relative">
      <div class="flex justify-between items-center gap-1" :class="isLoading && 'opacity-20'">
        <div v-if="$slots.prepend || prependIcon" class="flex">
          <slot name="prepend">
            <LazyBaseIcon v-if="prependIcon" v-bind="prependIcon" />
          </slot>
        </div>
        <slot />
        <div v-if="$slots.append || appendIcon" class="flex">
          <slot name="append">
            <LazyBaseIcon v-if="appendIcon" v-bind="appendIcon" />
          </slot>
        </div>
      </div>
      <LazyBaseLoading v-if="isLoading" class="absolute left-1/2" />
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import type { ExtractProps } from '@/types';

const LazyBaseIcon = defineAsyncComponent(() => import('./BaseIcon.vue'));
const LazyBaseLoading = defineAsyncComponent(() => import('./BaseLoading.vue'));

type IconProps = Omit<ExtractProps<InstanceType<typeof LazyBaseIcon>>, 'onClick'>;

const props = defineProps<
  Partial<{
    isDisabled: boolean;
    isLoading: boolean;
    prependIcon: IconProps;
    appendIcon: IconProps;
  }>
>();

const emit = defineEmits<{
  click: [Event];
}>();

const isDisabled = computed(() => props.isDisabled || props.isLoading);

const onCLick = (e: Event) => {
  if (isDisabled.value) {
    return;
  }

  emit('click', e);
};
</script>

<style>
button {
  all: unset;
  @apply bg-items border border-dark border-solid rounded p-2 text-center cursor-pointer select-none flex justify-center items-center;
  @apply with-hover:bg-items-hovered;
  @apply focus:on-focus;
  @apply disabled:pointer-events-none disabled:bg-dark disabled:opacity-25 disabled:text-items;
  @apply active:text-details-500 active:border-details-500;
}
</style>

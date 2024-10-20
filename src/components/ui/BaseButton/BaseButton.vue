<template>
  <button type="button" :disabled="isDisabled" @click="onCLick">
    <div class="flex justify-between relative">
      <div class="flex justify-between items-center gap-1" :class="isLoading && 'opacity-20'">
        <div v-if="$slots.prepend || propsIconPrepend" class="flex">
          <slot name="prepend">
            <LazyBaseIcon v-if="propsIconPrepend" v-bind="propsIconPrepend" />
          </slot>
        </div>
        <slot />
        <div v-if="$slots.append || propsIconAppend" class="flex">
          <slot name="append">
            <LazyBaseIcon v-if="propsIconAppend" v-bind="propsIconAppend" />
          </slot>
        </div>
      </div>
      <LazyBaseLoading v-if="isLoading" class="absolute left-1/2" />
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import type { Props as PropsIcon } from '@/components/ui/BaseIcon';

const LazyBaseIcon = defineAsyncComponent(() => import('@/components/ui/BaseIcon'));
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

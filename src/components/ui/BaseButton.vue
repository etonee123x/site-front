<template>
  <button type="button" :class="[$s.button, isActive && $s.button_active]" :disabled="isDisabled" @click="onCLick">
    <div class="flex justify-between">
      <div class="flex justify-between items-center gap-1" :class="isLoading && 'opacity-35'">
        <div v-if="$slots.prepend || prependIconPath" class="flex">
          <slot name="prepend">
            <LazyBaseIcon v-if="prependIconPath" :path="prependIconPath" />
          </slot>
        </div>
        <slot />
        <div v-if="$slots.append || appendIconPath" class="flex">
          <slot name="append">
            <LazyBaseIcon v-if="appendIconPath" :path="appendIconPath" />
          </slot>
        </div>
      </div>
      <LazyBaseLoading v-if="isLoading" class="absolute left-1/2" />
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

const LazyBaseIcon = defineAsyncComponent(() => import('./BaseIcon.vue'));
const LazyBaseLoading = defineAsyncComponent(() => import('./BaseLoading.vue'));

const props = defineProps<
  Partial<{
    isActive: boolean;
    isDisabled: boolean;
    isLoading: boolean;
    prependIconPath: string;
    appendIconPath: string;
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

<style lang="scss" module="$s">
button {
  all: unset;
  @apply bg-items border border-dark rounded p-2 text-center cursor-pointer select-none flex justify-center items-center;

  @include withHover {
    @apply bg-items-hovered;
  }

  &:active,
  &_active {
    @apply text-details-500 border-details-500;
  }

  &[disabled] {
    @apply pointer-events-none bg-dark text-items;
  }

  &:focus {
    @apply on-focus;
  }
}
</style>

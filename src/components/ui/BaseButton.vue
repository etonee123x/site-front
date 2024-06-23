<template>
  <button
    type="button"
    :class="[$style.button, isActive && $style.button_active]"
    :disabled="isDisabled"
    @click="onCLick"
  >
    <div :class="$style.inner">
      <div :class="[$style.slot, isLoading && $style.slot_hidden]">
        <div v-if="$slots.prepend || prependIconPath" :class="$style.wrapperPrependAppend">
          <slot name="prepend">
            <LazyBaseIcon v-if="prependIconPath" :path="prependIconPath" />
          </slot>
        </div>
        <slot />
        <div v-if="$slots.append || appendIconPath" :class="$style.wrapperPrependAppend">
          <slot name="append">
            <LazyBaseIcon v-if="appendIconPath" :path="appendIconPath" />
          </slot>
        </div>
      </div>
      <LazyBaseLoading v-if="isLoading" :class="$style.loading" />
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

<style lang="scss" module>
.inner {
  display: flex;
  justify-content: space-between;
}

.slot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.25rem;

  &_hidden {
    opacity: 33%;
  }
}

.loading {
  position: absolute;
  left: 50%;
}

.wrapperPrependAppend {
  display: flex;
}
</style>

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
            <BaseIcon v-if="prependIconPath" :path="prependIconPath" />
          </slot>
        </div>
        <slot />
        <div v-if="$slots.append || appendIconPath" :class="$style.wrapperPrependAppend">
          <slot name="append">
            <BaseIcon v-if="appendIconPath" :path="appendIconPath" />
          </slot>
        </div>
      </div>
      <BaseLoading v-if="isLoading" :class="$style.loading" />
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import BaseIcon from '@/components/BaseIcon.vue';
import BaseLoading from '@/components/BaseLoading.vue';

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
.button {
  all: unset;
  background-color: var(--color-items);
  border: 1px solid var(--color-dark);
  border-radius: 0.25rem;
  padding: 0.5rem;
  text-align: center;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;

  @include withHover {
    &:not(&[disabled]) {
      background-color: color-mix(in srgb, var(--color-items) 95%, var(--color-black));
    }
  }

  &:is(&:active, &_active):not(&[disabled]) {
    color: var(--color-details);
    border-color: var(--color-details);
  }

  &[disabled] {
    cursor: default;

    background-color: var(--color-dark);
    color: var(--color-items);
  }
}

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

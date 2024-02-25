<template>
  <button :class="[$style.button, isActive && $style.button_active]" :disabled="isDisabled" @click="onCLick">
    <span :class="$style.inner">
      <span :class="[$style.slot, isLoading && $style.slot_hidden]">
        <slot />
      </span>
      <BaseLoading v-if="isLoading" :class="$style.loading" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import BaseLoading from '@/components/BaseLoading.vue';

const props = defineProps<
  Partial<{
    isActive: boolean;
    isDisabled: boolean;
    isLoading: boolean;
  }>
>();

const emit = defineEmits<{
  click: [];
}>();

const isDisabled = computed(() => props.isDisabled || props.isLoading);

const onCLick = () => {
  if (isDisabled.value) {
    return;
  }

  emit('click');
};
</script>

<style lang="scss" module>
.button {
  all: unset;
  background-color: var(--color-items);
  border: 1px solid var(--color-dark);
  border-radius: 0.25rem;
  padding: 0.25rem;
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

  &_hidden {
    opacity: 33%;
  }
}

.loading {
  position: absolute;
  left: 50%;
}
</style>

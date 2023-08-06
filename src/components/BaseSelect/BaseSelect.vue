<template>
  <div
    ref="select"
    :class="['select', isOpened && 'select_opened']"
    @click="onWrapClick"
  >
    <div class="select__option select__option_selected">
      <span v-if="_modelValue" class="select__option-text">{{ _modelValue }}</span>
      <BaseIcon size="20" :path="isOpened ? mdiChevronUp : mdiChevronDown" />
    </div>
    <div v-if="isOpened" class="select__options">
      <div
        v-for="(option, idx) in options"
        :key="idx"
        :class="['select__option', option.class]"
        @click="() => onOptionClick(option)"
      >
        <p class="select__option-text">
          {{ option.text }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import { computed, ref } from 'vue';

import { type Option } from '@/components/BaseSelect/types';
import BaseIcon from '../BaseIcon.vue';

const props = defineProps<{
  modelValue?: Option;
  options: Array<Option>;
}>();

const emit = defineEmits<{
  'update:modelValue': [Option];
  'select': [Option];
}>();

const select = ref<HTMLDivElement>();

const isOpened = ref(false);

const _modelValue = computed<string | null>(() => props.modelValue?.text ?? null);

const onWrapClick = () => {
  isOpened.value = !isOpened.value;
};

const close = () => {
  if (!isOpened.value) {
    return;
  }

  isOpened.value = false;
};

onClickOutside(select, close);

const onOptionClick = (option: Option) => {
  emit('update:modelValue', option);
  emit('select', option);
};
</script>

<style lang="scss" scoped>
.select {
  position: relative;
  cursor: pointer;
  user-select: none;

  &_opened {
    .select__option_selected {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  &__options {
    max-height: 10rem;
    overflow-y: auto;
    border: 1px solid var(--color-dark);
    border-top: unset;
    position: absolute;
    left: 0;
    right: 0;
    background-color: var(--color-bg);
    padding: 0.25rem 0;
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    z-index: var(--z-index-select-options);
  }

  &__option {
    padding: 0.25rem;

    .hoverable &:hover {
      background-color: color-mix(in srgb, var(--color-items) 95%, var(--color-black));
    }

    &_selected {
      border: 1px solid var(--color-dark);
      border-radius: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.25rem;
      padding: 0.25rem;
    }
  }
}
</style>

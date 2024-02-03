<template>
  <div
    ref="refSelect"
    :class="[$style.select, isOpened && $style.select_opened]"
    @click="onWrapClick"
  >
    <div :class="[$style.option, $style.option_selected]">
      <span v-if="_modelValue">{{ _modelValue }}</span>
      <BaseIcon size="20" :path="path" />
    </div>
    <div v-if="isOpened" :class="$style.options">
      <div
        v-for="option in options"
        :key="option.id"
        :class="[$style.option, option.class]"
        @click="() => onOptionClick(option)"
      >
        {{ option.text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import { computed, ref } from 'vue';

import { type Option } from '@/components/BaseSelect/types';
import BaseIcon from '@/components/BaseIcon.vue';

const props = defineProps<{
  modelValue?: Option;
  options: Array<Option>;
}>();

const emit = defineEmits<{
  'update:modelValue': [Option];
  'select': [Option];
}>();

const refSelect = ref<HTMLDivElement>();

const isOpened = ref(false);

const path = computed(() => isOpened.value ? mdiChevronUp : mdiChevronDown);

const _modelValue = computed(() => props.modelValue?.text ?? null);

const onWrapClick = () => {
  isOpened.value = !isOpened.value;
};

const close = () => {
  if (!isOpened.value) {
    return;
  }

  isOpened.value = false;
};

onClickOutside(refSelect, close);

const onOptionClick = (option: Option) => {
  emit('update:modelValue', option);
  emit('select', option);
};
</script>

<style lang="scss" module>
.select {
  position: relative;
  cursor: pointer;
  user-select: none;

  &_opened {
    .option_selected {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
}

.options {
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

.option {
  padding: 0.25rem;

  @include withHover {
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
</style>

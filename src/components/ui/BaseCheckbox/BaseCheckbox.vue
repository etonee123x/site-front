<template>
  <div class="group" :class="CHECKBOX.default" @click="onClick">
    <BaseIcon class="group-has-[input:focus]:on-focus rounded-xs" :path="iconPath" />
    <input :id type="checkbox" :checked="model" class="sr-only" :disabled :readonly ref="input" @input="onInput" />
    <label v-if="$slots.default" :for="id" class="text-black">
      <slot />
    </label>
  </div>
</template>

<script setup lang="ts">
import { useToggle } from '@vueuse/core';
import BaseIcon from '@/components/ui/BaseIcon';
import { computed, useId, useTemplateRef } from 'vue';
import { mdiCheckboxBlank, mdiCheckboxMarked } from '@mdi/js';
import { CHECKBOX } from '@/helpers/ui';
import type { Props } from './types';

const id = useId();

const input = useTemplateRef('input');

const props = defineProps<Props>();

const model = defineModel<boolean>();

const toggleModel = useToggle(model);

const iconPath = computed(() => {
  if (props.disabled) {
    return mdiCheckboxBlank;
  }

  return model.value ? mdiCheckboxMarked : mdiCheckboxBlank;
});

const onInput: NonNullable<HTMLInputElement['oninput']> = () => {
  if (!input.value) {
    return;
  }

  input.value.checked = Boolean(model.value);
};

const onClick = () => {
  if (props.disabled || props.readonly) {
    return;
  }

  toggleModel();
};
</script>

<template>
  <div class="text-input-base group" @click="onClickContainer">
    <input
      :id
      :disabled
      :readonly
      :placeholder
      :value="model"
      ref="input"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
    />
    <div class="-me-3 flex items-center justify-center">
      <slot>
        <button
          tabindex="-1"
          class="hidden active:block group-has-[input:read-only]:group-has-[input:focus]:hidden group-has-[input:focus]:block cursor-pointer"
          @click="onClickButtonClear"
        >
          <BaseIcon :path="mdiCross" />
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mdiCross } from '@mdi/js';
import BaseIcon from '@/components/ui/BaseIcon';
import { useFocus, useToggle } from '@vueuse/core';
import { useTemplateRef } from 'vue';

const input = useTemplateRef('input');

defineProps<
  Partial<{
    id: HTMLInputElement['id'];
    disabled: boolean;
    readonly: boolean;
    placeholder: HTMLInputElement['placeholder'];
    label: string;
  }>
>();

const emit = defineEmits<{
  focus: [];
  blur: [];
}>();

const model = defineModel<string | null>();

const { focused: isFocused } = useFocus(input);

const toggleIsFocused = useToggle(isFocused);

const onInput: NonNullable<HTMLInputElement['oninput']> = (event) => {
  if (!(event.target && 'value' in event.target && typeof event.target.value === 'string')) {
    return;
  }

  model.value = event.target.value;
};

const onClickContainer = () => toggleIsFocused(true);

const onClickButtonClear = () => {
  model.value = '';
};

const onFocus = () => emit('focus');
const onBlur = () => emit('blur');

defineExpose({
  blur: () => input.value?.blur(),
  focus: () => input.value?.focus(),
});
</script>

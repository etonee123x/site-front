<template>
  <div :class="$style.textarea">
    <textarea
      ref="textarea"
      v-model="model"
      class="f-body-2"
      :class="$style.theTextarea"
      :placeholder="placeholder"
      @keydown.enter="onEnter"
      @paste="onPaste"
    />
    <ul v-if="isNotEmptyArray(errors)" class="text-sm" :class="$style.errors">
      <li v-for="error in errors" :key="error.$uid">{{ error.$message }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { isNotEmptyArray } from '@shared/src/utils';
import type { ErrorObject } from '@vuelidate/core';
import { useTextareaAutosize } from '@vueuse/core';

withDefaults(
  defineProps<{
    placeholder?: string;
    errors?: Array<ErrorObject>;
  }>(),
  {
    placeholder: undefined,
    errors: () => [],
  },
);

const emit = defineEmits<{
  submit: [];
  pasteFile: [File];
}>();

const onEnter = (e: KeyboardEvent) => {
  if (e.shiftKey) {
    return;
  }

  e.preventDefault();
  emit('submit');
};

const onPaste = (e: ClipboardEvent) => {
  const maybeFile = e.clipboardData?.files[0];

  if (!maybeFile) {
    return;
  }

  emit('pasteFile', maybeFile);
};

const model = defineModel<string>();

const { textarea } = useTextareaAutosize({ input: model, styleProp: 'minHeight' });

defineExpose({
  focus: () => textarea.value?.focus(),
});
</script>

<style lang="scss" module>
.theTextarea {
  border-radius: 0.5rem;
  border: 1px solid var(--color-dark);
  overflow: hidden;
  width: 100%;
  margin: 0;
  padding: 1rem 1rem;
  outline: unset;
  resize: none;
  display: flex;
  background-color: unset;
  flex: 1;

  &::placeholder {
    color: var(--color-dark);
  }

  &:focus {
    outline: auto;
  }
}

.textarea,
.errors {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.errors {
  color: var(--color-error);
}
</style>

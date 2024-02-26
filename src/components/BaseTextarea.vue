<template>
  <div :class="$style.textarea">
    <div class="f-body-2" :class="$style.textareaContainer">
      <textarea
        ref="textarea"
        v-model="model"
        :class="$style.theTextarea"
        :placeholder="placeholder"
        @keydown.enter="onEnter"
      />
    </div>
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
}>();

const onEnter = (e: KeyboardEvent) => {
  if (e.shiftKey) {
    return;
  }

  e.preventDefault();
  emit('submit');
};

const model = defineModel<string>();

const { textarea } = useTextareaAutosize({ input: model });
</script>

<style lang="scss" module>
.textareaContainer {
  border-radius: 0.5rem;
  border: var(--border-default);
  cursor: text;
  overflow: hidden;
}

.theTextarea {
  width: 100%;
  margin: 0;
  padding: 1rem 1rem;
  border: unset;
  outline: unset;
  resize: none;
  display: flex;

  &::placeholder {
    color: var(--color-dark);
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

<template>
  <div class="flex flex-col gap-1">
    <textarea
      ref="textarea"
      v-model="model"
      class="f-body-2 rounded-lg border border-dark overflow-hidden w-full m-0 p-4 outline-none resize-none flex bg-none flex-1 placeholder:text-dark focus:on-focus"
      :placeholder="placeholder"
      @keydown.enter.shift.prevent="onEnter"
      @paste="onPaste"
    />
    <ul v-if="isNotEmptyArray(errors)" class="text-sm flex flex-col gap-1 text-error">
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

const onEnter = () => emit('submit');

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

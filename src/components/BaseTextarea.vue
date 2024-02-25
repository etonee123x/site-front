<template>
  <div class="f-body-2" :class="$style.textarea">
    <textarea ref="textarea" v-model="model" :class="$style.theTextarea" :placeholder="placeholder" />
  </div>
</template>

<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core';

defineProps<{
  placeholder?: string;
}>();

const model = defineModel<string>({
  required: true,
});

const { textarea } = useTextareaAutosize({ input: model });
</script>

<style lang="scss" module>
.textarea {
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
</style>

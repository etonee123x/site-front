<template>
  <form ref="form" @submit.prevent="onSubmit">
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';

const emit = defineEmits<{
  submit: [Event];
}>();

const form = useTemplateRef('form');

const onSubmit = (e: Event) => emit('submit', e);

defineExpose({
  requestSubmit: () => form.value?.requestSubmit(),
});
</script>

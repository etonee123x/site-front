<template>
  <form ref="form">
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';

const form = useTemplateRef('form');

defineExpose({
  requestSubmit: () => form.value?.requestSubmit(),
});
</script>

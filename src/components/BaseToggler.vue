<template>
  <BaseButton :is-active="modelValue" @click="onClick">
    <slot />
  </BaseButton>
</template>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';

const model = defineModel<boolean>();

const onClick = () => {
  model.value = !model.value;
};
</script>

<template>
  <BaseButton :is-active="modelValue" @click="onClick">
    <slot />
  </BaseButton>
</template>

<script setup lang="ts">
import { useToggle } from '@vueuse/core';

import BaseButton from './BaseButton.vue';

const model = defineModel<boolean>();

const toggle = useToggle(model);

const onClick = () => toggle();
</script>

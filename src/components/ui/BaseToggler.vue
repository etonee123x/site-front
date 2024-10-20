<template>
  <BaseButton :class="model && 'text-details-500 border-details-500'" @click="onClick">
    <slot />
  </BaseButton>
</template>

<script setup lang="ts">
import { useToggle } from '@vueuse/core';

import BaseButton from './BaseButton';

const model = defineModel<boolean>();

const toggle = useToggle(model);

const onClick = () => toggle();
</script>

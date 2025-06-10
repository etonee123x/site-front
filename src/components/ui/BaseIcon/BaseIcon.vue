<template>
  <svg xmlns="http://www.w3.org/2000/svg" :class="ICON.default" viewBox="0 0 24 24">
    <path :d="path" fill="currentColor" />
  </svg>
</template>

<script setup lang="ts">
import { ICON } from '@/helpers/ui';
import type { Props } from './types';

defineProps<Props>();
</script>

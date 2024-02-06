<template>
  <span :class="$style.icon">
    <svg xmlns="http://www.w3.org/2000/svg" :width="size" :viewBox="`0 0 24 24`">
      <path :d="path" fill="currentColor" />
    </svg>
  </span>
</template>

<script setup lang="ts">
import type { Numberable } from '@/types';

withDefaults(
  defineProps<{
    path: string;
    size?: Numberable;
  }>(),
  {
    size: 24,
  },
);
</script>

<style lang="scss" module>
.icon {
  font-size: 0;
  display: inline-block;
}
</style>

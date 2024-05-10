<template>
  <span :class="$style.icon">
    <svg xmlns="http://www.w3.org/2000/svg" :width="size" :viewBox="`0 0 24 24`">
      <path :d="path" fill="currentColor" />
    </svg>
  </span>
</template>

<script setup lang="ts">
import { type CSSProperties } from 'vue';

withDefaults(
  defineProps<
    {
      path: string;
    } & Partial<{
      size?: CSSProperties['width'];
    }>
  >(),
  {
    size: '1em',
  },
);
</script>

<style lang="scss" module>
.icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>

<template>
  <span ref="refRoot" :class="$style.icon">
    <svg xmlns="http://www.w3.org/2000/svg" :width="size" :viewBox="`0 0 24 24`">
      <path :d="path" fill="currentColor" />
    </svg>
  </span>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import type { Numberable } from '@/types';

const props = withDefaults(
  defineProps<{
    path: string;
    size?: Numberable;
    isFontSize?: boolean;
  }>(),
  {
    size: 24,
  },
);

const refRoot = ref<HTMLSpanElement>();

const size = computed(() =>
  props.isFontSize && refRoot.value ? window.getComputedStyle(refRoot.value).getPropertyValue('font-size') : props.size,
);
</script>

<style lang="scss" module>
.icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>

<template>
  <div ref="refContainer" :class="$style.container">
    <div ref="refContent" :class="[$style.content, isAnimated && $style.content_animated]">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
import { computed, ref } from 'vue';

import type { Numberable } from '@/types';

const props = withDefaults(
  defineProps<
    Partial<{
      duration: Numberable;
    }>
  >(),
  {
    duration: 5000,
  },
);

const refContainer = ref<HTMLDivElement>();
const refContent = ref<HTMLDivElement>();

const { width: widthContainer } = useElementSize(refContainer, undefined, { box: 'border-box' });
const { width: widthContent } = useElementSize(refContent, undefined, { box: 'border-box' });

const diff = computed(() => widthContent.value - widthContainer.value);

const diffFormatted = computed(() => `-${diff.value}px`);

const isAnimated = computed(() => diff.value > 0);

const speedFormatted = computed(() => `${props.duration}ms`);
</script>

<style lang="scss" module>
.container {
  overflow: hidden;
  position: relative;
  display: inline-flex;
}

.content {
  margin: var(--base-always-scrollable--content--margin);
  white-space: nowrap;

  &_animated {
    animation: scroll v-bind('speedFormatted') linear infinite;
  }
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(v-bind('diffFormatted'));
  }

  0% {
    transform: translateX(0);
  }
}
</style>

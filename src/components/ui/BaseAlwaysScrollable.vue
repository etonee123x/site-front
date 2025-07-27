<template>
  <div class="overflow-hidden relative inline-flex" ref="container">
    <div
      class="whitespace-nowrap m-[var(--base-always-scrollable--content--margin)]"
      :class="isAnimated && $s.animated"
      ref="content"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
import { computed, useTemplateRef } from 'vue';

const props = withDefaults(
  defineProps<
    Partial<{
      duration: number | `${number}`;
    }>
  >(),
  {
    duration: 5000,
  },
);

const container = useTemplateRef('container');
const content = useTemplateRef('content');

const { width: widthContainer } = useElementSize(container, undefined, { box: 'border-box' });
const { width: widthContent } = useElementSize(content, undefined, { box: 'border-box' });

const diff = computed(() => widthContent.value - widthContainer.value);

const diffFormatted = computed(() => `-${diff.value}px`);

const isAnimated = computed(() => diff.value > 0);

const speedFormatted = computed(() => `${props.duration}ms`);
</script>

<style module="$s">
.animated {
  animation: scroll v-bind('speedFormatted') linear infinite;
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

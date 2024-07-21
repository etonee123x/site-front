<template>
  <Tippy :interactive="isInteractive" :trigger="trigger" max-width="none">
    <slot />
    <template #content>
      <slot name="content" />
    </template>
  </Tippy>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Tippy } from 'vue-tippy';

const props = withDefaults(
  defineProps<
    Partial<{
      isInteractive: boolean;
      triggers: Array<'focus' | 'mouseenter' | 'click' | 'manual'>;
    }>
  >(),
  {
    isInteractive: true,
  },
);

const trigger = computed(() => props.triggers?.join(' ') || undefined);
</script>

<style>
.tippy-content {
  --popover-content--max-width: 20rem;
  --popover-content--max-height: 25rem;
  @apply bg-background border border-dark rounded p-2 max-w-[--popover-content--max-width] max-h-[--popover-content--max-height] overflow-x-hidden overflow-y-auto;
}
</style>

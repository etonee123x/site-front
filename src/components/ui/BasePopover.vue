<template>
  <Tippy :interactive="isInteractive" :trigger="trigger">
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

<template>
  <component :is="tag" class="explorerElement">
    <div class="explorerElement__title">
      <slot />
    </div>
  </component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    tag?: string;
  }>(),
  {
    tag: 'div',
  },
);
</script>

<template>
  <component :is="tag" class="explorer-element">
    <div class="explorer-element__title">
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

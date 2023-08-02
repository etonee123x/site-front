<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :viewBox="`0 0 ${size} ${size}`">
    <path :d="path" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  path: string;
  size?: string;
}>(), {
  size: '24',
});
</script>

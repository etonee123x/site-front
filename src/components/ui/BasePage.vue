<template>
  <section class="layout-container py-4">
    <header class="mb-4">
      <h1 class="text-3xl font-semibold">{{ h1 }}</h1>
    </header>
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  h1: string;
}>();
</script>

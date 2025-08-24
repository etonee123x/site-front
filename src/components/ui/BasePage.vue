<template>
  <div class="layout-container py-4">
    <header class="mb-4">
      <h1 class="text-3xl font-semibold">{{ h1 }}</h1>
    </header>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';

const props = defineProps<{
  h1: string;
}>();

useHead({ title: () => props.h1 }, { tagPriority: 'low' });
</script>

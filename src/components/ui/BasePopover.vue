<template>
  <Tippy>
    <slot />
    <template #content>
      <slot name="content" />
    </template>
  </Tippy>
</template>

<script setup lang="ts">
import { Tippy } from 'vue-tippy';
</script>

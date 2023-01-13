<template>
  <div class="navbar">
    <router-link v-for="(element, idx) in navigation" :key="idx" class="navbar__element" :to="element.link">
      {{ element.text }}
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { useExplorerStore } from '@/stores/explorer';
import { storeToRefs } from 'pinia';

const { navigation } = storeToRefs(useExplorerStore());
</script>

<style scoped lang="scss">
.navbar {
  display: flex;
  justify-content: flex-start;
  overflow-x: auto;

  &__element {
    line-height: 3rem;
    white-space: nowrap;
    display: table-cell;
    vertical-align: middle;

    &:not(:first-child)::before {
      content: '>';
      color: initial;
      padding: 0 0.25rem;
    }

    &:last-child {
      color: $color-details;
    }
  }
}
</style>

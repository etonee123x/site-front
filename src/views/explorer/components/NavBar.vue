<template>
  <div class="navbar">
    <div v-for="(element, idx) in explorerStore.navigation" :key="idx" class="navbar__element">
      <router-link class="navbar__text" :to="element.link">{{ element.text }}</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExplorerStore } from '@/stores/explorer';

const explorerStore = useExplorerStore();
</script>

<style scoped lang="scss">
.navbar {
  display: flex;
  flex-direction: row;
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

  &__text {
    display: inline-block;
  }
}
</style>

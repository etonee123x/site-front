<template>
  <ul :class="$style.navbar">
    <li v-for="(navigationItem, idx) in navigationItems" :key="idx" :class="$style.navigationItem">
      <RouterLink :to="navigationItem.link">
        {{ navigationItem.text }}
      </RouterLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useExplorerStore } from '@/stores/explorer';

const explorerStore = useExplorerStore();
const { navigationItems } = storeToRefs(explorerStore);
</script>

<style module lang="scss">
.navbar {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  overflow-x: auto;
  background-color: var(--color-bg);
  padding: 0.5rem 0;
}

.navigationItem {
  white-space: nowrap;
  display: table-cell;
  vertical-align: middle;

  &:not(:first-child)::before {
    content: '>';
    color: initial;
    padding: 0 0.5rem;
  }

  &:last-child {
    color: var(--color-details);
  }
}
</style>

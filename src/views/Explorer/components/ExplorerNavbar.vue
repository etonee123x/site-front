<template>
  <div class="sticky top-0 flex items-center overflow-x-auto bg-background py-2">
    <ul class="l-container">
      <li
        v-for="(navigationItem, index) in navigationItems"
        :key="index"
        :class="$s.navigationItem"
        class="whitespace-nowrap table-cell align-middle last:text-details-500"
      >
        <RouterLink :to="navigationItem.link">
          {{ navigationItem.text }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useExplorerStore } from '@/stores/explorer';

const explorerStore = useExplorerStore();
const { navigationItems } = storeToRefs(explorerStore);
</script>

<style module="$s" lang="scss">
.navigationItem:not(:first-child)::before {
  content: '>';
  color: initial;
  padding: 0 0.5rem;
}
</style>

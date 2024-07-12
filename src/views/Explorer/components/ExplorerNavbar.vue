<template>
  <div class="sticky top-0 flex items-center overflow-x-auto bg-background py-2">
    <ul class="l-container">
      <li
        v-for="(navigationItem, index) in navigationItems"
        :key="index"
        :class="[
          'whitespace-nowrap',
          'table-cell',
          'align-middle',
          'last:text-details-500',
          'before:text-[initial]',
          'before:px-2',
          'before:[--tw-content:\'>\']',
          'before:first:[--tw-content:\'\']',
          'before:first:p-0',
        ]"
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

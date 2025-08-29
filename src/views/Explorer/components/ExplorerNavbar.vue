<template>
  <nav class="sticky bottom-0 flex items-center overflow-x-auto bg-background z-explorer-navbar py-1">
    <ul>
      <li
        v-for="navigationItem in explorerStore.folderData?.navigationItems ?? []"
        class="whitespace-nowrap table-cell align-middle last:text-details-500 before:text-[initial] before:px-2 before:[--tw-content:'>'] first:before:[--tw-content:''] first:before:p-0"
        :key="navigationItem.link"
      >
        <RouterLink :to="navigationItem.link">
          {{ navigationItem.text }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useExplorerStore } from '@/stores/explorer';

const explorerStore = useExplorerStore();
</script>

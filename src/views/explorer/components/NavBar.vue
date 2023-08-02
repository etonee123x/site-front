<template>
  <ul class="navbar">
    <router-link
      v-for="(element, idx) in navigation"
      :key="idx"
      v-slot="{ href, navigate, isActive, isExactActive }"
      :to="element.link"
      custom
    >
      <li
        :class="[
          'navbar__element',
          isActive && 'router-link-active',
          isExactActive && 'router-link-exact-active'
        ]"
      >
        <a :href="href" @click="navigate">
          {{ element.text }}
        </a>
      </li>
    </router-link>
  </ul>
</template>

<script setup lang="ts">
import { useExplorerStore } from '@/stores/explorer';
import { storeToRefs } from 'pinia';

const { navigation } = storeToRefs(useExplorerStore());
</script>

<style scoped lang="scss">
.navbar {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  overflow-x: auto;
  background-color: var(--color-bg);
  padding: 0.5rem 0;

  &__element {
    white-space: nowrap;
    display: table-cell;
    vertical-align: middle;

    &:not(:first-child)::before {
      content: '>';
      color: initial;
      padding: 0 0.25rem;
    }

    &:last-child {
      color: var(--color-details);
    }
  }
}
</style>

<template>
  <RouterLink :to="element.url" :class="[$style.directoryElement, $style.directoryElement_folder]">
    <div :class="$style.title">
      {{ element.name }}
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { type ItemFolder } from '@shared/src/types';

defineProps<{
  element: ItemFolder;
}>();
</script>

<style module lang="scss">
.directoryElement {
  background-color: var(--color-items);
  border: 2px var(--color-dark) solid;
  border-radius: 0.5rem;
  width: 100%;
  cursor: pointer;

  @include withHover {
    border-color: var(--color-details);
    background-color: color-mix(in srgb, var(--color-items) 95%, var(--color-black));
  }

  &:focus-visible {
    @include onFocus();
    text-decoration: none;
  }
}

.title {
  max-width: 70%;
  overflow-x: auto;
  overflow-y: hidden;
  margin: 0.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(34, 60, 80, 0.4);
}

.content {
  margin: 0.5rem;
}

.birthTime {
  text-align: right;
  margin: 0.5rem;
}

.directoryElement {
  &_folder {
    background-color: var(--color-folders);

    @include withHover {
      background-color: color-mix(in srgb, var(--color-folders) 90%, var(--color-black));
    }
  }
}
</style>

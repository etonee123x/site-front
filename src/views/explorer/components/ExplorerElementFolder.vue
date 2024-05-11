<template>
  <RouterLink :to="element.url">
    <div :class="[$style.directoryElement, $style.directoryElement_folder]">
      <div :class="$style.title">
        {{ element.name }}
      </div>
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
@import '@/views/Explorer/assets/styles/directory-element.scss';

.directoryElement {
  &_folder {
    background-color: var(--color-folders);

    @include withHover {
      background-color: color-mix(in srgb, var(--color-folders) 90%, var(--color-black));
    }
  }
}
</style>

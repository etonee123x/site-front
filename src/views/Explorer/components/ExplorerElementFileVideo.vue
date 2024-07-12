<template>
  <ElementFileWrapper :element="element">
    <div class="flex justify-center max-w-full">
      <video class="max-w-full" :src="element.src" controls />
    </div>
  </ElementFileWrapper>
</template>

<script setup lang="ts">
import { type ItemVideo } from '@shared/src/types';

import ElementFileWrapper from './_ElementFileWrapper.vue';

defineProps<{
  element: ItemVideo;
}>();
</script>

<template>
  <ElementFileWrapper :element>
    <PreviewVideo :src="element.src" />
  </ElementFileWrapper>
</template>

<script setup lang="ts">
import type { ItemVideo } from '@etonee123x/shared/helpers/folderData';

import ElementFileWrapper from './_ElementFileWrapper.vue';

import PreviewVideo from '@/components/PreviewVideo.vue';
import type { ItemWithSinceTimestamps } from '@/api/folderData';

defineProps<{
  element: ItemWithSinceTimestamps<ItemVideo>;
}>();
</script>

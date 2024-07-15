<template>
  <div class="flex justify-center items-center max-w-full relative">
    <BaseIcon class="absolute text-items" size="33%" :path="mdiPlayCircleOutline" />
    <video class="max-w-full" :src="src" />
  </div>
</template>

<script setup lang="ts">
import { mdiPlayCircleOutline } from '@mdi/js';

import BaseIcon from '@/components/ui/BaseIcon.vue';
defineProps<{
  src: string;
}>();
</script>

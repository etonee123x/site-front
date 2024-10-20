<template>
  <div class="flex justify-center items-center max-w-full relative">
    <BaseIcon class="absolute text-items size-1/3" :path="mdiPlayCircleOutline" />
    <video class="max-w-full" :src />
  </div>
</template>

<script setup lang="ts">
import { mdiPlayCircleOutline } from '@mdi/js';

import BaseIcon from '@/components/ui/BaseIcon';
defineProps<{
  src: string;
}>();
</script>

<template>
  <a :href="fileUrl" target="_blank" :class="$s.attachmentWithUnknownExtension">
    <BaseIcon :path="mdiFileQuestionOutline" class="text-2xl" />
    <span>{{ fileUrl }}</span>
  </a>
</template>

<script setup lang="ts">
import { mdiFileQuestionOutline } from '@mdi/js';

import BaseIcon from '@/components/ui/BaseIcon.vue';

defineProps<{
  fileUrl: string;
}>();
</script>

<style lang="scss" module="$s">
.attachmentWithUnknownExtension {
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
}
</style>

<template>
  <a :href="fileUrl" target="_blank" :class="$s.attachmentWithUnknownExtension" @click.stop>
    <BaseIcon :path="mdiFileOutline" class="text-2xl" />
    <span>{{ fileText }}</span>
  </a>
</template>

<script setup lang="ts">
import { mdiFileOutline } from '@mdi/js';
import { computed } from 'vue';

import BaseIcon from '@/components/ui/BaseIcon.vue';

const props = defineProps<{
  fileUrl: string;
}>();

const fileText = computed(() => props.fileUrl.match(/[^/]+$/)?.[0] || props.fileUrl);
</script>

<style lang="scss" module="$s">
.attachmentWithUnknownExtension {
  display: inline-flex;
  align-items: flex-end;
  gap: 0.125rem;
}
</style>

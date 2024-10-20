<template>
  <a :href="fileUrl" target="_blank" class="inline-flex items-end gap-0.5" @click.stop>
    <BaseIcon :path="mdiFileOutline" class="text-2xl" />
    <BaseAlwaysScrollable class="flex-1" duration="12000">
      {{ fileText }}
    </BaseAlwaysScrollable>
  </a>
</template>

<script setup lang="ts">
import { mdiFileOutline } from '@mdi/js';
import { computed } from 'vue';

import BaseIcon from '@/components/ui/BaseIcon';
import BaseAlwaysScrollable from '@/components/ui/BaseAlwaysScrollable.vue';

const props = defineProps<{
  fileUrl: string;
}>();

const fileText = computed(() => props.fileUrl.match(/[^/]+$/)?.[0] || props.fileUrl);
</script>

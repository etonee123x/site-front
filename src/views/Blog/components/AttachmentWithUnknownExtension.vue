<template>
  <a :href="fileUrl" target="_blank" :class="$s.attachmentWithUnknownExtension" @click.stop>
    <BaseIcon :path="mdiFileOutline" class="text-2xl" />
    <BaseAlwaysScrollable :class="$s.fileName" duration="12000">
      {{ fileText }}
    </BaseAlwaysScrollable>
  </a>
</template>

<script setup lang="ts">
import { mdiFileOutline } from '@mdi/js';
import { computed } from 'vue';

import BaseIcon from '@/components/ui/BaseIcon.vue';
import BaseAlwaysScrollable from '@/components/ui/BaseAlwaysScrollable.vue';

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

.fileName {
  flex: 1;
}
</style>

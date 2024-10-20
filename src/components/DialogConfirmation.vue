<template>
  <BaseDialog :title ref="baseDialog">
    <div class="flex flex-col gap-4">
      <p>{{ message }}</p>
      <div class="flex gap-2"></div>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';

import BaseDialog from '@/components/ui/BaseDialog.vue';

defineProps<{
  title: string;
  message: string;
}>();

const baseDialog = useTemplateRef('baseDialog');

defineExpose({
  open: () => baseDialog.value?.open(),
  close: () => baseDialog.value?.close(),
});
</script>

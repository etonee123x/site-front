<template>
  <BaseDialog ref="refBaseDialog" :title="title">
    <div class="flex flex-col gap-4">
      <p>{{ message }}</p>
      <div class="flex gap-2"></div>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import BaseDialog from '@/components/ui/BaseDialog.vue';

defineProps<{
  title: string;
  message: string;
}>();

const refBaseDialog = ref<InstanceType<typeof BaseDialog>>();

defineExpose({
  open: () => refBaseDialog.value?.open(),
  close: () => refBaseDialog.value?.close(),
});
</script>

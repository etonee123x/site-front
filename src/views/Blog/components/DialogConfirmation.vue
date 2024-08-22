<template>
  <BaseDialog ref="refDialogConfirmation" :title="title" @close="cancel" @confirm="confirm">
    <div class="flex flex-col gap-4">
      <p>{{ message }}</p>
      <div class="flex gap-2"></div>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { useConfirmDialog } from '@vueuse/core';

import BaseDialog from '@/components/ui/BaseDialog.vue';

defineProps({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const refDialogConfirmation = ref<InstanceType<typeof BaseDialog>>();

const { reveal, confirm, cancel } = useConfirmDialog();

const openDialog = async () => {
  refDialogConfirmation.value?.open();

  const result = await reveal();

  closeDialog();

  return result;
};

const closeDialog = () => {
  refDialogConfirmation.value?.close();
};

defineExpose({
  open: openDialog,
  close: closeDialog,
});
</script>

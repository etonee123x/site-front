<template>
  <BaseDialog ref="refDialogConfirmation" :title="title" @close="onClose">
    <div class="flex flex-col gap-4">
      <p>{{ message }}</p>
      <div class="flex gap-2"></div>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';

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

const openDialog = () => {
  refDialogConfirmation.value?.open();
};

const closeDialog = () => {
  refDialogConfirmation.value?.close();
};

const onClose = () => {};

defineExpose({
  open: openDialog,
  close: closeDialog,
});
</script>

<template>
  <BaseDialog :title ref="baseDialog">
    <p>{{ message }}</p>
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

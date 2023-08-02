<template>
  <BaseDialog ref="dialog" @close="onDialogClose">
    <div>Тут у нас пожилой текст!</div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';

import BaseDialog from '@/components/BaseDialog.vue';

import { DynamicComponent } from '@/types';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [boolean];
}>();

const dialog = ref<DynamicComponent | null>(null);

const onDialogClose = () => emit('update:modelValue', false);

watch(
  () => props.modelValue,
  value => {
    if (!value) {
      return;
    }

    if (!dialog.value?.theDialog) {
      return;
    }

    (dialog.value.theDialog as HTMLDialogElement).showModal();
  },
);
</script>

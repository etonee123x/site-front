<template>
  <dialog ref="theDialog" class="dialog">
    <div ref="theDialogInner" class="dialog__inner">
      <slot />
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

const theDialog = ref<HTMLDialogElement | null>();
const theDialogInner = ref<HTMLDivElement | null>();

const emit = defineEmits<{
  close: [];
}>();

const onClickOutsideDialog = () => {
  if (!theDialog.value) {
    return;
  }

  theDialog.value.close();
  emit('close');
};

onClickOutside(theDialogInner, onClickOutsideDialog);

defineExpose({
  theDialog,
});
</script>

<style lang="scss" scoped>
.dialog {
  padding: 0;

  &__inner {
    padding: 1rem;
  }
}
</style>

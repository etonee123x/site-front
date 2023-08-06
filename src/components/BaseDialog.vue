<template>
  <dialog ref="theDialog" class="dialog">
    <div ref="theDialogInner" class="dialog__inner">
      <div class="dialog__header">
        <span class="dialog__title f-h2">{{ title }}</span>
        <span class="dialog__close-icon" @click="onClickCloseIcon">
          <BaseIcon size="20" :path="mdiClose" />
        </span>
      </div>
      <div class="dialog__main">
        <slot v-bind="{ close }" />
      </div>
      <div class="dialog__footer">
        <BaseButton @click="onClickButtonCancel">
          {{ buttonTextCancel }}
        </BaseButton>
        <BaseButton @click="onClickButtonSave">
          {{ buttonTextSave }}
        </BaseButton>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { mdiClose } from '@mdi/js';

import BaseIcon from '@/components/BaseIcon.vue';
import BaseButton from './BaseButton.vue';

const theDialog = ref<HTMLDialogElement | null>();
const theDialogInner = ref<HTMLDivElement | null>();

const props = withDefaults(defineProps<{
  title?: string;
  width?: string;
  height?: string;
  buttonTextSave?: string;
  buttonTextCancel?: string;
}>(), {
  title: undefined,
  width: 'auto',
  height: 'auto',
  buttonTextSave: 'Save',
  buttonTextCancel: 'Cancel',
});

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const close = () => {
  theDialog.value?.close();
  emit('close');
};

onClickOutside(theDialogInner, close);

const onClickCloseIcon = close;

const onClickButtonCancel = close;

const onClickButtonSave = () => {
  emit('confirm');
  close();
};

defineExpose({ theDialog });
</script>

<style lang="scss" scoped>
.dialog {
  width: v-bind('props.width');
  height: v-bind('props.height');
  padding: 0;
  border: 1px var(--color-details) solid;
  outline: none;
  border-radius: 0.5rem;
  background-color: var(--color-bg);

  &::backdrop {
    background: rgba(0, 0, 0, 50%);
  }

  &__inner {
    padding: 1rem;
    display: flex;
    gap: 1.5rem;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__footer {
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  &__close-icon {
    cursor: pointer;
  }
}
</style>

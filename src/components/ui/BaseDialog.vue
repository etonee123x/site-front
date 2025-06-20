<template>
  <dialog
    class="layout-container mx-auto p-0 border border-details-500 outline-hidden rounded-lg bg-background m-[auto_!important] backdrop:bg-[rgba(0,0,0,0.33)]"
    ref="dialog"
    @close="onClose"
    @cancel.prevent="onClose"
  >
    <div class="p-4 flex flex-col w-full [scrollbar-gutter:stable_both-edges]" ref="dialogInner">
      <slot v-if="!isHiddenHeader" name="header" v-bind="{ close }">
        <div class="flex justify-between items-center mb-6">
          <span v-if="isNotNil(title)" class="text-lg">{{ title }}</span>
          <LazyBaseButton class="ms-auto" @click="onClickCloseIcon">
            <LazyBaseIcon :path="mdiClose" />
          </LazyBaseButton>
        </div>
      </slot>
      <slot v-bind="{ close }" />
      <slot v-if="!isHiddenFooter" name="footer" v-bind="{ close }">
        <div v-if="buttons.length" class="flex justify-end gap-2 mt-auto">
          <LazyBaseButton v-for="button in buttons" :key="button.id" @click="button.onClick">
            {{ button.text }}
          </LazyBaseButton>
        </div>
      </slot>
    </div>
  </dialog>
</template>

<i18n lang="yaml">
En:
  confirm: 'Confirm'
  cancel: 'Cancel'
Ru:
  confirm: 'Подтвердить'
  cancel: 'Отмена'
</i18n>

<script setup lang="ts">
import { computed, ref, defineAsyncComponent, onBeforeUnmount, useTemplateRef } from 'vue';
import { onClickOutside, useMutationObserver, useScrollLock, useToggle } from '@vueuse/core';
import { mdiClose } from '@mdi/js';
import { useI18n } from 'vue-i18n';
import { isNotNil } from '@etonee123x/shared/utils/isNotNil';
import type { FunctionCallback } from '@etonee123x/shared/types';
import type { WithId } from '@etonee123x/shared/helpers/id';
import { MAIN } from '@/constants/selectors';

const LazyBaseButton = defineAsyncComponent(() => import('./BaseButton'));
const LazyBaseIcon = defineAsyncComponent(() => import('./BaseIcon'));

const dialog = useTemplateRef('dialog');
const dialogInner = useTemplateRef('dialogInner');

const isLocked = useScrollLock(document.getElementById(MAIN));
const toggleIsLocked = useToggle(isLocked);

interface Button extends WithId {
  text: string;
  onClick: FunctionCallback;
}

const props = defineProps<
  Partial<{
    title: string;
    buttons: Array<Button>;
    isHiddenHeader: boolean;
    isHiddenFooter: boolean;
  }>
>();

const emit = defineEmits<{
  open: [];
  close: [];
  confirm: [];
  cancel: [];
}>();

const { t } = useI18n({ useScope: 'local' });

const buttons = computed(
  () =>
    props.buttons ?? [
      {
        id: 0,
        text: t('cancel'),
        onClick: () => {
          emit('cancel');
          close();
        },
      },
      {
        id: 1,
        text: t('confirm'),
        onClick: () => {
          emit('confirm');
          close();
        },
      },
    ],
);

const isOpened = ref(Boolean(dialog.value?.open));

useMutationObserver(
  dialog,
  () => {
    isOpened.value = Boolean(dialog.value?.open);
  },
  {
    attributes: true,
  },
);

const open = () => {
  if (isOpened.value) {
    return;
  }

  dialog.value?.showModal();
  toggleIsLocked(true);
  emit('open');
};

const close = () => {
  if (!isOpened.value) {
    return;
  }

  dialog.value?.close();
  toggleIsLocked(false);
  emit('close');
};

const onClose = close;
const onClickCloseIcon = close;

onClickOutside(dialogInner, close);

onBeforeUnmount(() => toggleIsLocked(false));

defineExpose({
  open,
  close,
  isOpened,
});
</script>

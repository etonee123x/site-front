<template>
  <dialog
    class="l-container p-0 border border-details-500 outline-none rounded-lg bg-background m-[auto_!important] backdrop:bg-[rgba(0,0,0,0.33)]"
    ref="refDialog"
    @close="onClose"
    @cancel.prevent="onClose"
  >
    <div class="p-4 flex flex-col h-full w-full [scrollbar-gutter:stable_both-edges]" ref="refDialogInner">
      <slot v-if="!isHiddenHeader" name="header" v-bind="{ close }">
        <div class="flex justify-between items-center mb-6">
          <span v-if="isNotNil(title)" class="text-lg">{{ title }}</span>
          <LazyBaseIcon :path="mdiClose" class="text-xl ms-auto" @click="onClickCloseIcon" />
        </div>
      </slot>
      <slot v-bind="{ close }" />
      <slot v-if="!isHiddenFooter" name="footer" v-bind="{ close }">
        <div v-if="isNotEmptyArray(buttons)" class="flex justify-end gap-2 mt-auto">
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
import { computed, ref, defineAsyncComponent, onBeforeUnmount } from 'vue';
import { onClickOutside, useMutationObserver, useScrollLock, useToggle } from '@vueuse/core';
import { mdiClose } from '@mdi/js';
import { useI18n } from 'vue-i18n';
import { isNotEmptyArray, isNotNil } from '@shared/src/utils';
import type { FunctionCallback, WithId } from '@shared/src/types';

import { useComponentsStore } from '@/stores/components';
import { addId } from '@/utils/addId';

const LazyBaseButton = defineAsyncComponent(() => import('./BaseButton'));
const LazyBaseIcon = defineAsyncComponent(() => import('./BaseIcon'));

const refDialog = ref<HTMLDialogElement>();
const refDialogInner = ref<HTMLDivElement>();

const componentsStore = useComponentsStore();

const isLocked = useScrollLock(() => componentsStore.main);
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
    props.buttons ??
    [
      {
        text: t('cancel'),
        onClick: () => {
          emit('cancel');
          close();
        },
      },
      {
        text: t('confirm'),
        onClick: () => {
          emit('confirm');
          close();
        },
      },
    ].map(addId),
);

const isOpened = ref(Boolean(refDialog.value?.open));

useMutationObserver(
  refDialog,
  () => {
    isOpened.value = Boolean(refDialog.value?.open);
  },
  {
    attributes: true,
  },
);

const open = () => {
  if (isOpened.value) {
    return;
  }

  refDialog.value?.showModal();
  toggleIsLocked(true);
  emit('open');
};

const close = () => {
  if (!isOpened.value) {
    return;
  }

  refDialog.value?.close();
  toggleIsLocked(false);
  emit('close');
};

const onClose = close;
const onClickCloseIcon = close;

onClickOutside(refDialogInner, close);

onBeforeUnmount(() => toggleIsLocked(false));

defineExpose({
  open,
  close,
  isOpened,
});
</script>

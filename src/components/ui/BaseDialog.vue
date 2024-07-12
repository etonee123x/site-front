<template>
  <dialog
    ref="refDialog"
    class="l-container p-0 border border-details-500 outline-none rounded-lg bg-background m-[auto_!important] backdrop:bg-[rgba(0,0,0,0.33)]"
  >
    <div ref="refDialogInner" class="p-4 flex flex-col h-full w-full [scrollbar-gutter:stable_both-edges]">
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
import { computed, ref, watch, type CSSProperties, defineAsyncComponent } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { mdiClose } from '@mdi/js';
import { useI18n } from 'vue-i18n';
import { isNotEmptyArray, isNotNil } from '@shared/src/utils';
import type { FunctionCallback, WithId } from '@shared/src/types';

import { addId } from '@/utils';

const LazyBaseButton = defineAsyncComponent(() => import('./BaseButton.vue'));
const LazyBaseIcon = defineAsyncComponent(() => import('./BaseIcon.vue'));

const refDialog = ref<HTMLDialogElement>();
const refDialogInner = ref<HTMLDivElement>();

interface Button extends WithId {
  text: string;
  onClick: FunctionCallback;
}

const props = defineProps<
  Partial<{
    title: string;
    width: CSSProperties['width'];
    height: CSSProperties['height'];
    buttons: Array<Button>;
    isHiddenHeader: boolean;
    isHiddenFooter: boolean;
  }>
>();

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const model = defineModel<boolean>();

const { t } = useI18n({ useScope: 'local' });

const buttons = computed(
  () =>
    props.buttons ??
    [
      {
        text: t('cancel'),
        onClick: close,
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

const close = () => {
  refDialog.value?.close();
  emit('close');
};

const open = () => refDialog.value?.showModal();

onClickOutside(refDialogInner, close);

const onClickCloseIcon = close;

watch(model, (value) => (value ? refDialog.value?.showModal() : refDialog.value?.close()));

defineExpose({
  open,
  close,
});
</script>

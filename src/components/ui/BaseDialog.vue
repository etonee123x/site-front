<template>
  <dialog ref="refDialog" :style="style" class="l-container" :class="$style.dialog">
    <div ref="refDialogInner" :class="$style.inner">
      <slot v-if="!isHiddenHeader" name="header" v-bind="{ close }">
        <div :class="$style.header">
          <span v-if="isNotNil(title)" class="text-lg" :class="$style.title">{{ title }}</span>
          <LazyBaseIcon :path="mdiClose" class="text-xl" :class="$style.iconClose" @click="onClickCloseIcon" />
        </div>
      </slot>
      <slot v-bind="{ close }" />
      <slot v-if="!isHiddenFooter" name="footer" v-bind="{ close }">
        <div v-if="isNotEmptyArray(buttons)" :class="$style.footer">
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
import { isNotEmptyArray, isNotNil, pick } from '@shared/src/utils';
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

const style = computed(() => pick(props, ['height', 'width']));

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

<style lang="scss" module>
.dialog {
  padding: 0;
  border: 1px var(--color-details) solid;
  outline: none;
  border-radius: 0.5rem;
  background-color: var(--color-bg);
  margin: auto;

  &::backdrop {
    background: rgba(0, 0, 0, 33.33%);
  }
}

.inner {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: auto;
}

.iconClose {
  margin-inline-start: auto;
}
</style>

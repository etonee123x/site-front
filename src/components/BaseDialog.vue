<template>
  <dialog ref="refDialog" :style="style" :class="$style.dialog">
    <div ref="refDialogInner" :class="$style.inner">
      <div :class="$style.header">
        <span class="f-h2" :class="$style.title">{{ title }}</span>
        <BaseIcon size="20" :path="mdiClose" :class="$style.closeIcon" @click="onClickCloseIcon" />
      </div>
      <div :class="$style.main">
        <slot v-bind="{ close }" />
      </div>
      <div :class="$style.footer">
        <BaseButton v-for="button in buttons" :key="button.id" @click="button.onClick">
          {{ button.text }}
        </BaseButton>
      </div>
    </div>
  </dialog>
</template>

<i18n lang="yaml">
en:
  confirm: 'Confirm'
  cancel: 'Cancel'
ru:
  confirm: 'Подтвердить'
  cancel: 'Отмена'
</i18n>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { mdiClose } from '@mdi/js';
import { useI18n } from 'vue-i18n';
import { watch } from 'vue';

import BaseButton from '@/components/BaseButton.vue';
import BaseIcon from '@/components/BaseIcon.vue';
import { addId } from '@/utils';

const refDialog = ref<HTMLDialogElement>();
const refDialogInner = ref<HTMLDivElement>();

const props = withDefaults(
  defineProps<
    Partial<{
      title: string;
      width: string;
      height: string;
      buttonTextConfirm: string;
      buttonTextCancel: string;
    }>
  >(),
  {
    title: undefined,
    width: 'auto',
    height: 'auto',
    buttonTextConfirm: 'Confirm',
    buttonTextCancel: 'Cancel',
  },
);

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const model = defineModel<boolean>();

const { t } = useI18n({ useScope: 'local' });

const style = computed(() => ({
  width: props.width,
  height: props.height,
}));

const buttons = computed(() =>
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

onClickOutside(refDialogInner, close);

const onClickCloseIcon = close;

watch(model, (value) => (value ? refDialog.value?.showModal() : refDialog.value?.close()));
</script>

<style lang="scss" module>
.dialog {
  padding: 0;
  border: 1px var(--color-details) solid;
  outline: none;
  border-radius: 0.5rem;
  background-color: var(--color-bg);

  &::backdrop {
    background: rgba(0, 0, 0, 50%);
  }
}

.inner {
  padding: 1rem;
  display: flex;
  gap: 1.5rem;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.closeIcon {
  cursor: pointer;
}
</style>

<template>
  <div>
    <button type="button" :class="INPUT.default" @click="onClick">
      <input tabindex="-1" class="fixed start-0 translate-x-[-200%] pointer-events-none" type="file" />
      <BaseIcon :path="mdiFilePlusOutline" />
    </button>
    <BaseDialog :title="t('title')" ref="baseDialog" @confirm="onConfirm" @close="onClose" @click.stop>
      <LazyBaseFilesList v-if="model.length" v-model="model" />
      <BaseButton class="mx-auto my-4" :propsIconPrepend="{ path: mdiPlus }" @click="onClickAdd">
        {{ t('add') }}
      </BaseButton>
    </BaseDialog>
  </div>
</template>

<i18n lang="yaml">
Ru:
  title: 'Файлы'
  add: 'Добавить'
En:
  title: 'Files'
  add: 'Add'
</i18n>

<script setup lang="ts">
import { ref, defineAsyncComponent, useTemplateRef } from 'vue';
import { useFileDialog } from '@vueuse/core';
import { mdiFilePlusOutline, mdiPlus } from '@mdi/js';
import { useI18n } from 'vue-i18n';

import BaseButton from './BaseButton';
import BaseIcon from './BaseIcon';
import BaseDialog from './BaseDialog.vue';

import { useIsUniqueFileCheck } from '@/composables/useIsUniqueFileCheck';
import { INPUT } from '@/helpers/ui';

const LazyBaseFilesList = defineAsyncComponent(() => import('./BaseFilesList.vue'));

const { t } = useI18n({ useScope: 'local' });

const baseDialog = useTemplateRef('baseDialog');

const { open: openInitial, onChange: onChangeInitial, reset: resetInitial } = useFileDialog();

onChangeInitial((files) => {
  if (!files) {
    return;
  }

  model.value = Array.from(files);

  baseDialog.value?.open();
  resetInitial();
});

const { open: openInModal, onChange: onChangeInModal, reset: resetInModal } = useFileDialog();

const model = ref<Array<File>>([]);

const emit = defineEmits<{
  'update:model-value': [Array<File>];
}>();

const onClick = () => openInitial();

const onClickAdd = () => openInModal();

const checkIsUnique = useIsUniqueFileCheck(model);

onChangeInModal((files) => {
  if (!files) {
    return;
  }

  Array.from(files).forEach((file) => {
    if (!checkIsUnique(file)) {
      return;
    }

    model.value.push(file);
  });

  resetInModal();
});

const onConfirm = () => emit('update:model-value', model.value);

const onClose = () => {
  model.value = [];
};
</script>

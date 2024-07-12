<template>
  <div>
    <div
      class="flex justify-center items-center cursor-pointer p-4 border border-dark rounded-lg"
      :class="isFocused && 'on-focus'"
      @click="onClick"
    >
      <input class="fixed start-0 translate-x-[-200%]" type="file" @click.prevent @focus="onFocus" @blur="onBlur" />
      <BaseIcon class="text-4xl" :path="mdiFilePlusOutline" />
    </div>
    <BaseDialog ref="refDialog" :title="t('title')" @confirm="onConfirm" @close="onClose" @click.stop>
      <LazyBaseFilesList v-if="isNotEmptyArray(model)" v-model="model" />
      <BaseButton class="mx-auto my-4" :prepend-icon-path="mdiPlus" @click="onClickAdd">
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
import { ref, defineAsyncComponent } from 'vue';
import { useFileDialog } from '@vueuse/core';
import { mdiFilePlusOutline, mdiPlus } from '@mdi/js';
import { useI18n } from 'vue-i18n';
import { isNotEmptyArray } from '@shared/src/utils';

import BaseButton from './BaseButton.vue';
import BaseIcon from './BaseIcon.vue';
import BaseDialog from './BaseDialog.vue';

import { useIsUniqueFileCheck } from '@/composables/useIsUniqueFileCheck';
import { useIsFocused } from '@/composables/useIsFocused';

const LazyBaseFilesList = defineAsyncComponent(() => import('./BaseFilesList.vue'));

const { t } = useI18n({ useScope: 'local' });

const refDialog = ref<InstanceType<typeof BaseDialog>>();

const { onFocus, onBlur, isFocused } = useIsFocused();

const { open: openInitial, onChange: onChangeInitial, reset: resetInitial } = useFileDialog();
onChangeInitial((files) => {
  if (!files) {
    return;
  }

  model.value = Array.from(files);

  refDialog.value?.open();
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

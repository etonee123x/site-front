<template>
  <div :class="$s.inputFile">
    <div :class="$s.trigger" @click="onClick">
      <input :class="$s.input" type="file" @focus="onFocus" @blur="onBlur" />
      <BaseIcon :size="32" :path="mdiFilePlusOutline" />
    </div>
    <BaseDialog ref="refDialog" :title="t('title')" @confirm="onConfirm" @close="onClose" @click.stop>
      <BaseFilesPreview v-if="isNotEmptyArray(model)" v-model="model" />
      <BaseButton :class="$s.addMore" :prepend-icon-path="mdiPlus" @click="onClickAdd">
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
import { ref } from 'vue';
import { useFileDialog, useToggle } from '@vueuse/core';
import { mdiFilePlusOutline, mdiPlus } from '@mdi/js';
import { useI18n } from 'vue-i18n';
import { isNotEmptyArray } from '@shared/src/utils';

import { useIsUniqueFileCheck } from '@/composables';
import BaseFilesPreview from '@/components/BaseFilesPreview.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseIcon from '@/components/BaseIcon.vue';
import BaseDialog from '@/components/BaseDialog.vue';

const { t } = useI18n({ useScope: 'local' });

const refDialog = ref<InstanceType<typeof BaseDialog>>();

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

const [isFocused, setIsFocused] = useToggle();
isFocused.value;

const onFocus = () => setIsFocused(true);
const onBlur = () => setIsFocused(false);

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

<style lang="scss" module="$s">
.trigger {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 1rem;
  border: 1px solid var(--color-dark);
  border-radius: 0.5rem;
  height: 100%;
  width: 100%;

  @include withHover {
    &:not(&[disabled]) {
      background-color: color-mix(in srgb, var(--color-items) 95%, var(--color-black));
    }
  }
}

.input {
  position: fixed;
  left: 0;
  transform: translateX(-100%);
}

.addMore {
  margin: 0 auto;
}
</style>

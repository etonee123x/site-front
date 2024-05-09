<template>
  <div :class="$s.editPost">
    <div :class="$s.inputs">
      <BaseTextarea
        ref="refTextarea"
        v-model="model.text"
        :class="$s.textArea"
        :placeholder="t('textareaPlaceholder')"
        :errors="v$.text.$errors"
        @submit="onSubmit"
      />
      <BaseInputFile v-model="model.files" :class="$s.inputFile" />
    </div>
    <div v-if="isNotEmptyArray(model.files)">
      <div :class="$s.filesHeader">
        <div class="text-xl">{{ t('files') }}</div>
        <BaseButton :class="$s.buttonDelete" @click="onClickDeleteFiles">
          <BaseIcon :path="mdiDelete" />
        </BaseButton>
      </div>
      <BaseFilesPreview v-if="isNotEmptyArray(model.files)" v-model="model.files" />
    </div>
  </div>
</template>

<i18n lang="yaml">
Ru:
  textareaPlaceholder: 'Сообщение'
  files: 'Файлы'
En:
  textareaPlaceholder: 'Message'
  files: 'Files'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, type UnwrapRef } from 'vue';
import type { PostData } from '@shared/src/types';
import { isNotEmptyArray } from '@shared/src/utils';
import { mdiDelete } from '@mdi/js';

import { useVuelidateBlogPostData } from '@/views/Blog/composables';
import BaseTextarea from '@/components/BaseTextarea.vue';
import BaseInputFile from '@/components/BaseInputFile.vue';
import BaseIcon from '@/components/BaseIcon.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseFilesPreview from '@/components/BaseFilesPreview.vue';

defineProps<{
  v$: UnwrapRef<ReturnType<typeof useVuelidateBlogPostData>['v$']>;
}>();

const { t } = useI18n({ useScope: 'local' });

const refTextarea = ref<InstanceType<typeof BaseTextarea>>();

const emit = defineEmits<{
  submit: [];
}>();

const model = defineModel<PostData>({ required: true });

const onSubmit = () => emit('submit');

const onClickDeleteFiles = () => {
  model.value.files = [];
};

defineExpose({
  focus: () => refTextarea.value?.focus(),
});
</script>

<style lang="scss" module="$s">
.inputs,
.editPost {
  display: flex;
  gap: 1rem;
}

.editPost {
  flex-direction: column;
}

.textArea {
  flex: 1;
}

.inputFile {
  position: sticky;
  top: 0.5rem;
}

.files {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
}

.filesHeader {
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.buttonDelete {
  padding: 0.125rem;
}
</style>

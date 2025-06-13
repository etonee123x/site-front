<template>
  <div class="flex gap-4 flex-col">
    <div class="flex gap-4">
      <BaseTextarea
        class="flex-1"
        :placeholder="t('textareaPlaceholder')"
        :errors="v$.text.$errors"
        ref="baseTextarea"
        v-model="model.text"
        @submit="onSubmit"
        @pasteFile="onPasteFile"
      />
      <div class="sticky top-2 flex flex-col gap-2 h-min">
        <BaseInputFile @update:modelValue="onUpdateModelValueInputFile" />
        <BaseAudioRecorder @update:modelValue="onUpdateModelValueAudioRecorder" />
      </div>
    </div>
    <div v-if="isNotEmptyArray(files)">
      <div class="mb-3 flex items-center gap-2">
        <div class="text-xl">{{ t('files') }}</div>
        <LazyBaseIcon :path="mdiDelete" @click="onClickDeleteFiles" />
      </div>
      <LazyBaseFilesList v-model="files" />
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
import { type UnwrapRef, defineAsyncComponent, useTemplateRef } from 'vue';
import type { PostData } from '@etonee123x/shared/types/blog';
import { isNotEmptyArray } from '@etonee123x/shared/utils/isNotEmptyArray';
import { mdiDelete } from '@mdi/js';

import { useVuelidateBlogPostData } from '@/views/Blog/composables';
import BaseTextarea from '@/components/ui/BaseTextarea.vue';
import BaseInputFile from '@/components/ui/BaseInputFile.vue';
import BaseAudioRecorder from '@/components/ui/BaseAudioRecorder.vue';

const LazyBaseFilesList = defineAsyncComponent(() => import('@/components/ui/BaseFilesList.vue'));
const LazyBaseIcon = defineAsyncComponent(() => import('@/components/ui/BaseIcon'));

defineProps<{ v$: UnwrapRef<ReturnType<typeof useVuelidateBlogPostData>['v$']> }>();

const { t } = useI18n({ useScope: 'local' });

const baseTextarea = useTemplateRef('baseTextarea');

const emit = defineEmits<{
  submit: [];
}>();

const model = defineModel<PostData>({ required: true });
const files = defineModel<Array<File>>('files', { default: [] });

const onSubmit = () => emit('submit');

const onClickDeleteFiles = () => {
  files.value = [];
};

const onPasteFile = (file: File) => {
  files.value.push(file);
};

const onUpdateModelValueInputFile: InstanceType<typeof BaseInputFile>['onUpdate:model-value'] = (_files) => {
  files.value = files.value.concat(_files);
};

const onUpdateModelValueAudioRecorder: InstanceType<typeof BaseAudioRecorder>['onUpdate:model-value'] = (blob) => {
  files.value.push(new File([blob], 'test.ogg', { type: blob.type }));
};

defineExpose({
  focusTextarea: () => baseTextarea.value?.focus(),
});
</script>

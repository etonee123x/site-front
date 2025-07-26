<template>
  <div class="flex gap-4 flex-col">
    <div class="flex gap-4">
      <BaseTextarea
        class="flex-1"
        :placeholder="t('textareaPlaceholder')"
        :errors="v$.text.$errors"
        ref="baseTextarea"
        v-model="model.text"
        @keydown:enter="onKeyDownEnter"
        @paste="onPaste"
      />
      <div class="sticky top-2 flex flex-col gap-2 h-min">
        <BaseInputFile @update:modelValue="onUpdateModelValueInputFile" />
        <!-- <BaseAudioRecorder @update:modelValue="onUpdateModelValueAudioRecorder" /> -->
      </div>
    </div>
    <div v-if="files.length">
      <div class="mb-3 flex items-center gap-2">
        <div class="text-xl">{{ t('files') }}</div>
        <BaseButton @click="onClickDeleteFiles">
          <BaseIcon :path="mdiDelete" />
        </BaseButton>
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
import type { Post } from '@etonee123x/shared/types/blog';
import { mdiDelete } from '@mdi/js';

import { type useVuelidatePostData } from '../composables/useVuelidatePostData';
import BaseTextarea from '@/components/ui/BaseTextarea.vue';
import BaseInputFile from '@/components/ui/BaseInputFile.vue';
import BaseButton from '@/components/ui/BaseButton/BaseButton.vue';
import BaseIcon from '@/components/ui/BaseIcon';
import type { ForPost } from '@etonee123x/shared/types/database';
// import BaseAudioRecorder from '@/components/ui/BaseAudioRecorder.vue';

const LazyBaseFilesList = defineAsyncComponent(() => import('@/components/ui/BaseFilesList.vue'));

defineProps<{ v$: UnwrapRef<ReturnType<typeof useVuelidatePostData>['v$']> }>();

const { t } = useI18n({ useScope: 'local' });

const baseTextarea = useTemplateRef('baseTextarea');

const emit = defineEmits<{
  'keydown:enter': [KeyboardEvent];
}>();

const model = defineModel<ForPost<Post>>({ required: true });
const files = defineModel<Array<File>>('files', { default: [] });

const onClickDeleteFiles = () => {
  files.value = [];
};

const onKeyDownEnter: InstanceType<typeof BaseTextarea>['onKeydown:enter'] = (e) => emit('keydown:enter', e);

const onPaste: InstanceType<typeof BaseTextarea>['onPaste'] = (e) => {
  const maybeFileList = e.clipboardData?.files;

  if (!maybeFileList?.length) {
    return;
  }

  e.preventDefault();
  files.value = files.value.concat([...maybeFileList]);
};

const onUpdateModelValueInputFile: InstanceType<typeof BaseInputFile>['onUpdate:model-value'] = (_files) => {
  files.value = files.value.concat(_files);
};

// const onUpdateModelValueAudioRecorder: InstanceType<typeof BaseAudioRecorder>['onUpdate:model-value'] = (blob) => {
//   files.value.push(new File([blob], 'test.ogg', { type: blob.type }));
// };

defineExpose({
  focusTextarea: () => baseTextarea.value?.focus(),
});
</script>

<template>
  <div class="flex gap-4 flex-col">
    <div class="flex gap-4">
      <BaseTextarea
        ref="refTextarea"
        v-model="model.text"
        class="flex-1"
        :placeholder="t('textareaPlaceholder')"
        :errors="v$.text.$errors"
        @submit="onSubmit"
        @paste-file="onPasteFile"
      />
      <div class="sticky top-2 flex flex-col gap-1 text-2xl">
        <BaseEmojis @select="onSelectEmoji" />
        <BaseInputFile v-model="files" />
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
import { ref, type UnwrapRef, defineAsyncComponent, nextTick } from 'vue';
import type { PostData } from '@shared/src/types';
import { isNotEmptyArray } from '@shared/src/utils';
import { mdiDelete } from '@mdi/js';

import { useVuelidateBlogPostData } from '@/views/Blog/composables';
import BaseTextarea from '@/components/ui/BaseTextarea.vue';
import BaseInputFile from '@/components/ui/BaseInputFile.vue';
import BaseEmojis from '@/components/ui/BaseEmojis.vue';

const LazyBaseFilesList = defineAsyncComponent(() => import('@/components/ui/BaseFilesList.vue'));
const LazyBaseIcon = defineAsyncComponent(() => import('@/components/ui/BaseIcon.vue'));

defineProps<{
  v$: UnwrapRef<ReturnType<typeof useVuelidateBlogPostData>['v$']>;
}>();

const { t } = useI18n({ useScope: 'local' });

const refTextarea = ref<InstanceType<typeof BaseTextarea>>();

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

const onSelectEmoji = (emoji: string) => {
  if (!refTextarea.value) {
    return;
  }

  const { selectionStart, selectionEnd } = refTextarea.value.textarea;

  model.value.text = [
    model.value.text.slice(0, selectionStart),
    emoji,
    model.value.text.slice(selectionEnd, model.value.text.length),
  ].join('');

  const newSelectionStart = selectionStart + emoji.length;

  nextTick(() => refTextarea.value?.textarea.setSelectionRange(newSelectionStart, newSelectionStart));
};

defineExpose({
  focusTextarea: () => refTextarea.value?.focus(),
});
</script>

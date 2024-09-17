<template>
  <div class="flex gap-4 flex-col">
    <div class="flex gap-4">
      <BasePopover ref="refBasePopover" :triggers="['manual']" class="flex-1">
        <BaseTextarea
          ref="refTextarea"
          v-model="model.text"
          :placeholder="t('textareaPlaceholder')"
          :errors="v$.text.$errors"
          @submit="onSubmit"
          @paste-file="onPasteFile"
          @input="handleInput"
        />

        <template #content>эмоджики</template>
      </BasePopover>
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
import { useTextSelection } from '@vueuse/core';
import { ref, type UnwrapRef, defineAsyncComponent, nextTick } from 'vue';
import type { PostData } from '@shared/src/types';
import { isNotEmptyArray } from '@shared/src/utils';
import { mdiDelete } from '@mdi/js';

import { useVuelidateBlogPostData } from '@/views/Blog/composables';
import BaseTextarea from '@/components/ui/BaseTextarea.vue';
import BaseInputFile from '@/components/ui/BaseInputFile.vue';
import BaseEmojis from '@/components/ui/BaseEmojis.vue';
import BasePopover from '@/components/ui/BasePopover.vue';

const LazyBaseFilesList = defineAsyncComponent(() => import('@/components/ui/BaseFilesList.vue'));
const LazyBaseIcon = defineAsyncComponent(() => import('@/components/ui/BaseIcon.vue'));

defineProps<{
  v$: UnwrapRef<ReturnType<typeof useVuelidateBlogPostData>['v$']>;
}>();

const { t } = useI18n({ useScope: 'local' });

const refTextarea = ref<InstanceType<typeof BaseTextarea>>();
const refBasePopover = ref<InstanceType<typeof BasePopover>>();

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

const searchTerm = ref('');

const { rects, ...rest } = useTextSelection();

const handleInput = () => {
  if (!refTextarea.value?.textarea) {
    return;
  }

  const cursorPosition = refTextarea.value?.textarea.selectionStart;
  const textBeforeCursor = model.value.text.slice(0, cursorPosition);
  const lastColonIndex = textBeforeCursor.lastIndexOf(':');

  console.log('Позиция курсора:', cursorPosition);
  console.log('Текст до курсора:', textBeforeCursor);
  console.log('Последний индекс двоеточия:', lastColonIndex);

  lastColonIndex !== -1 && textBeforeCursor[lastColonIndex - 1] !== ' '
    ? (() => {
        const term = textBeforeCursor.slice(lastColonIndex + 1);
        console.log('Найденный термин после двоеточия:', term);

        term.length > 0 && !term.includes(' ')
          ? (() => {
              console.log({ rects, ...rest });
              refBasePopover.value?.refTippy?.setProps({
                getReferenceClientRect: () => rects.value[0],
              });

              console.log('Отображаем поповер');
              refBasePopover.value?.show();
            })()
          : (console.log('Поповер пустой или содержит пробел'), refBasePopover.value?.hide());

        searchTerm.value = term;
      })()
    : (console.log('Двоеточие не найдено или перед ним пробел'), refBasePopover.value?.hide());
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

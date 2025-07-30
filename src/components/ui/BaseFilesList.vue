<template>
  <ol class="flex gap-4 flex-col" ref="ol">
    <li v-for="(file, index) in model" class="flex items-center gap-2" :key="getKeyByFile(file)">
      <FilesListFilePreview :file />
      <BaseAlwaysScrollable duration="10000" class="flex-1">
        {{ file.name }}
      </BaseAlwaysScrollable>
      <div class="text-2xl flex gap-2 ms-auto items-center">
        <BaseIcon class="cursor-grab text-dark" :class="CLASS_HANDLE" :path="mdiSwapVertical" />
        <BaseButton @click="() => onClickDeteleByIndex(index)">
          <BaseIcon :path="mdiDelete" />
        </BaseButton>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { mdiDelete, mdiSwapVertical } from '@mdi/js';
import { isNil } from '@etonee123x/shared/utils/isNil';
import Sortable from 'sortablejs';
import { useTemplateRef, watch } from 'vue';

import BaseIcon from '@/components/ui/BaseIcon';
import FilesListFilePreview from '@/components/ui/FilesListFilePreview.vue';
import BaseAlwaysScrollable from '@/components/ui/BaseAlwaysScrollable.vue';
import BaseButton from '@/components/ui/BaseButton';

const CLASS_HANDLE = '_handle';

const model = defineModel<Array<File>>({ required: true });

const ol = useTemplateRef('ol');
let sortable: null | Sortable = null;

const onClickDeteleByIndex = (index: number) => {
  model.value.splice(index, 1);
};

const getKeyByFile = (file: File) => [file.name, file.type, file.lastModified, file.size].join('-');

watch(ol, (v) => {
  if (!v) {
    return sortable?.destroy();
  }

  sortable = Sortable.create(v, {
    handle: `.${CLASS_HANDLE}`,
    onEnd: (event) => {
      if (isNil(event.oldIndex) || isNil(event.newIndex) || event.newIndex === event.oldIndex) {
        return;
      }

      model.value.splice(event.newIndex, 0, ...model.value.splice(event.oldIndex, 1));
    },
  });
});
</script>

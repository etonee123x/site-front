<template>
  <ol class="flex gap-4 flex-col ps-8" ref="refUl">
    <li v-for="(file, index) in model" :key="getKeyByFile(file)">
      <div class="flex items-center gap-2">
        <FilesListFilePreview :file />
        <BaseAlwaysScrollable duration="10000" class="flex-1">
          {{ file.name }}
        </BaseAlwaysScrollable>
        <div class="text-2xl flex gap-2 ms-auto items-center">
          <BaseIcon class="cursor-grab text-dark" :class="CLASS_HANDLE" :path="mdiSwapVertical" />
          <button @click="() => onClickDeteleByIndex(index)">
            <BaseIcon :path="mdiDelete" />
          </button>
        </div>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { mdiDelete, mdiSwapVertical } from '@mdi/js';
import { isNil } from '@shared/src/utils';
import Sortable from 'sortablejs';
import { ref, watch } from 'vue';

import BaseIcon from './BaseIcon';
import FilesListFilePreview from './FilesListFilePreview.vue';
import BaseAlwaysScrollable from './BaseAlwaysScrollable.vue';

const CLASS_HANDLE = '_handle';

const model = defineModel<Array<File>>({ required: true });

const refUl = ref<HTMLUListElement>();
let sortable: null | Sortable = null;

const onClickDeteleByIndex = (index: number) => {
  model.value.splice(index, 1);
};

const getKeyByFile = (file: File) => [file.name, file.type, file.lastModified, file.size].join('-');

watch(refUl, (v) => {
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

<template>
  <ol ref="refUl" :class="$s.filesList">
    <li v-for="(file, index) in model" :key="getKeyByFile(file)" :class="$s.fileWrapper">
      <div :class="$s.file">
        <FilesListFilePreview :file="file" />
        <BaseAlwaysScrollable duration="10000" :class="$s.fileName">
          {{ file.name }}
        </BaseAlwaysScrollable>
        <div class="text-2xl" :class="$s.icons">
          <BaseIcon :class="$s.handle" :path="mdiSwapVertical" />
          <BaseIcon :path="mdiDelete" @click="() => onClickDeteleByIndex(index)" />
        </div>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { mdiDelete, mdiSwapVertical } from '@mdi/js';
import { isNil } from '@shared/src/utils';
import Sortable from 'sortablejs';
import { ref, watch, useCssModule } from 'vue';

import BaseIcon from './BaseIcon.vue';
import FilesListFilePreview from './FilesListFilePreview.vue';
import BaseAlwaysScrollable from './BaseAlwaysScrollable.vue';

const model = defineModel<Array<File>>({ required: true });

const $s = useCssModule('$s');

const refUl = ref<HTMLUListElement>();
let sortable: null | Sortable = null;

const onClickDeteleByIndex = (index: number) => {
  model.value.splice(index, 1);
};

const onEnd: Sortable.Options['onEnd'] = (event) => {
  if (isNil(event.oldIndex) || isNil(event.newIndex) || event.newIndex === event.oldIndex) {
    return;
  }

  model.value.splice(event.newIndex, 0, ...model.value.splice(event.oldIndex, 1));
};

const getKeyByFile = (file: File) => [file.name, file.type, file.lastModified, file.size].join('-');

watch(refUl, (v) => {
  if (!v) {
    return sortable?.destroy();
  }

  sortable = Sortable.create(v, {
    handle: `.${$s.handle}`,
    onEnd,
  });
});
</script>

<style lang="scss" module="$s">
.filesList {
  display: flex;
  gap: 1rem;
  flex-direction: column;
  padding-inline-start: 2rem;
}

.file {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fileName {
  flex: 1;
}

.icons {
  display: flex;
  gap: 0.5rem;
  margin-inline-start: auto;
  align-items: center;
}

.handle {
  cursor: grab;
  color: var(--color-dark);
}

.index {
  margin-inline-end: 0.25rem;
}

.fileWrapper {
  list-style-type: inherit;
}
</style>

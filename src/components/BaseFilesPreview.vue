<template>
  <ul v-if="isNotEmptyArray(model)" ref="refUl" :class="$s.files">
    <li v-for="(file, index) in model" :key="getKeyByFile(file)" :class="$s.file">
      <div>{{ file.name }}</div>
      <div :class="$s.icons">
        <BaseIcon :class="$s.handle" :path="mdiSync" />
        <BaseButton :class="$s.buttonDelete">
          <BaseIcon :path="mdiDelete" @click="() => onClickDeteleByIndex(index)" />
        </BaseButton>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { mdiDelete, mdiSync } from '@mdi/js';
import { isNil, isNotEmptyArray } from '@shared/src/utils';
import Sortable from 'sortablejs';
import { ref, watch, useCssModule } from 'vue';

import BaseButton from '@/components/BaseButton.vue';
import BaseIcon from '@/components/BaseIcon.vue';

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
.files {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
}

.file {
  display: flex;
  justify-content: space-between;
}

.buttonDelete {
  padding: 0.125rem;
}

.icons {
  display: flex;
  gap: 1rem;
}

.handle {
  cursor: grab;
}
</style>

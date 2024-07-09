<template>
  <VueSelect
    v-bind="vueSelect"
    v-model="model"
    :close-on-select="!isMultiple"
    :searchable="false"
    :clearable="false"
    :deselect-from-dropdown="isMultiple"
    :reduce
    :options
    :label
    :multiple="isMultiple"
    :class="$style.select"
  >
    <template #selected-option-container="{ option, deselect }">
      <div v-if="isMultiple" class="outline outline-1 rounded flex gap-1 m-0.5 p-0.5">
        <div>{{ getOptionLabel(option) }}</div>
        <BaseIcon :path="mdiClose" @click.prevent.stop="() => deselect(option)" />
      </div>
    </template>
    <template #option="option">
      <div :class="$style.option" class="flex gap-1 justify-between items-center text-xs">
        <div>{{ getOptionLabel(option) }}</div>
        <BaseIcon :class="$style.iconSelected" :path="mdiCheck" />
      </div>
    </template>
  </VueSelect>
</template>

<script setup lang="ts" generic="Option, Model">
import { mdiCheck, mdiClose } from '@mdi/js';
import VueSelect, { type VueSelectProps } from 'vue-select';

import BaseIcon from '@/components/ui/BaseIcon.vue';

import 'vue-select/dist/vue-select.css';

type ModelElement = Model extends Array<infer _ModelElement> ? _ModelElement : Model;

const props = withDefaults(
  defineProps<
    Partial<{
      vueSelect: Partial<VueSelectProps>;
      isMultiple: boolean;
      label: keyof Option;
      reduce: (option: Option) => ModelElement;
      isClearable: boolean;
    }> & {
      options: Array<Option>;
    }
  >(),
  {
    reduce: (option: Option) => option as ModelElement,
  },
);

const model = defineModel<Model>();

const getOptionLabel = (option: Option) =>
  option && typeof option === 'object' ? option[props.label ?? ('label' as keyof Option)] : option;
</script>

<style lang="scss" module>
.select {
  --vs-dropdown-option-padding: 0.5rem;
  --vs-border-color: var(--color-dark);
  --vs-controls-color: var(--color-dark);
  --vs-dropdown-min-width: 100%;
  --vs-dropdown-option--active-bg: var(--color-details);
}

.option {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
}

.iconSelected {
  display: none;
}

:global(.vs__dropdown-option--selected) {
  .iconSelected {
    display: block;
  }
}
</style>
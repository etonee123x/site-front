<template>
  <div @click="onClick">
    <div :class="$style.directoryElement">
      <div :class="$style.header">
        <div :class="$style.title">
          {{ element.name }}
        </div>
        <div :class="$style.birthTime" title="Created at">
          {{ getFormattedBirthTime(element.birthtime) }}
        </div>
      </div>
      <div :class="$style.content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getFormattedBirthTime } from '@/utils';
import { ItemFile } from '@types';

defineProps<{
  element: ItemFile;
}>();

const emit = defineEmits<{
  'click': [];
}>();

const onClick = () => emit('click');
</script>

<style lang="scss" module>
@import '@/views/explorer/assets/styles/directory-element.scss';
</style>

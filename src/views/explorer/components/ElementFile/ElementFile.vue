<template>
  <div @click="onClick">
    <div :class="$style.directoryElement">
      <div :class="$style.header">
        <div :class="$style.title">
          {{ element.name }}
        </div>
        <div :class="$style.birthTime" title="Created at">
          {{ birthTimeFormatted }}
        </div>
      </div>
      <div :class="$style.content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import { ItemFile } from '@types';

const props = defineProps<{
  element: ItemFile;
}>();

const emit = defineEmits<{
  click: [];
}>();

const onClick = () => emit('click');

const birthTimeFormatted = computed(() => format(new Date(props.element.birthtime), 'dd/MM/yyyy, HH:mm'));
</script>

<style lang="scss" module>
@import '@/views/explorer/assets/styles/directory-element.scss';
</style>

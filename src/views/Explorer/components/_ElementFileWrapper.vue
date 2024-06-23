<template>
  <div tabindex="0" :class="$style.directoryElement" @keydown.enter="onClick" @click="onClick">
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
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import { type ItemFile } from '@shared/src/types';

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
@import '@/views/Explorer/assets/styles/directory-element.scss';
</style>

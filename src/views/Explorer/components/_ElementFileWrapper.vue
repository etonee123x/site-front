<template>
  <div tabindex="0" :class="$s.explorerElement" @keydown.enter="onClick" @click="onClick">
    <div class="flex justify-between">
      <div :class="$s.title">
        {{ element.name }}
      </div>
      <div class="text-right m-2" title="Created at">
        {{ birthTimeFormatted }}
      </div>
    </div>
    <BaseHr />
    <div class="m-2">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import { type ItemFile } from '@shared/src/types';

import BaseHr from '@/components/ui/BaseHr.vue';

const props = defineProps<{
  element: ItemFile;
}>();

const emit = defineEmits<{
  click: [];
}>();

const onClick = () => emit('click');

const birthTimeFormatted = computed(() => format(new Date(props.element.birthtime), 'dd/MM/yyyy, HH:mm'));
</script>

<style lang="scss" module="$s">
@import '../assets/styles/explorerElement.scss';
</style>

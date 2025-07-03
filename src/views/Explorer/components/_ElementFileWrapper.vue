<template>
  <div tabindex="0" class="explorerElement" @keydown.enter="onClick" @click="onClick">
    <div class="flex justify-between">
      <div class="explorerElement__title">
        {{ element.name }}
      </div>
      <div class="text-right m-2" title="Created at">
        {{ birthTimeFormatted }}
      </div>
    </div>
    <hr />
    <div class="m-2">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import type { ItemFile } from '@etonee123x/shared/helpers/folderData';

const props = defineProps<{
  element: ItemFile;
}>();

const emit = defineEmits<{
  click: [];
}>();

const onClick = () => emit('click');

const birthTimeFormatted = computed(() => format(new Date(props.element.birthtime), 'dd/MM/yyyy, HH:mm'));
</script>

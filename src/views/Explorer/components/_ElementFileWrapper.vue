<template>
  <div tabindex="0" class="explorerElement" @keydown.enter="onClick" @click="onClick">
    <div class="flex justify-between">
      <div class="explorerElement__title">
        {{ element.name }}
      </div>
      <div class="text-right m-2" title="Created at">
        {{ sinceBirthtime }}
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
import type { ItemFile } from '@etonee123x/shared/helpers/folderData';
import { useDateFns } from '@/composables/useDateFns';
import type { WithSinceBirthtime } from '@/api/folderData';

const props = defineProps<{
  element: ItemFile & WithSinceBirthtime;
}>();

const emit = defineEmits<{
  click: [];
}>();

const onClick = () => emit('click');

const { intlFormatDistanceToNow } = useDateFns();

const sinceBirthtime = computed(() => intlFormatDistanceToNow(props.element.sinceBirthtime));
</script>

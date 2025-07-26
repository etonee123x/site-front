<template>
  <div tabindex="0" class="explorerElement" @keydown.enter="onClick" @click="onClick">
    <div class="flex justify-between">
      <div class="explorerElement__title">
        {{ element.name }}
      </div>
      <div class="text-right m-2" title="Created at">
        {{ sinceCreated }}
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
import type { WithMeta, WithSinceTimestamps } from '@etonee123x/shared/types/database';

const props = defineProps<{
  element: ItemFile & WithMeta<WithSinceTimestamps>;
}>();

const emit = defineEmits<{
  click: [];
}>();

const onClick = () => emit('click');

const { intlFormatDistanceToNow } = useDateFns();

const sinceCreated = computed(() => intlFormatDistanceToNow(props.element._meta.sinceCreated, { numeric: 'always' }));
</script>

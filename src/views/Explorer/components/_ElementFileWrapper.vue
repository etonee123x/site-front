<template>
  <article tabindex="0" class="explorerElement" @keydown.enter="onClick" @click="onClick">
    <header class="flex justify-between">
      <div class="explorerElement__title">
        {{ element.name }}
      </div>
      <div class="text-right m-2" title="Created at">
        {{ sinceCreated }}
      </div>
    </header>
    <hr />
    <div class="p-2">
      <slot />
    </div>
  </article>
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

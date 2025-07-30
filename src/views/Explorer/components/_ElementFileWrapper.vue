<template>
  <article tabindex="0" class="explorerElement" @keydown.enter="onClick" @click="onClick">
    <header class="flex justify-between">
      <div class="explorerElement__title">
        {{ element.name }}
      </div>
      <time :datetime="createdAtISO" :title="t('createdAt', { at: createdAtISO })" class="text-right m-2">
        {{ sinceCreated }}
      </time>
    </header>
    <hr />
    <div class="p-2">
      <slot />
    </div>
  </article>
</template>

<i18n lang="yaml">
En:
  createdAt: 'Created at { at }'
Ru:
  createdAt: 'Создано в { at }'
</i18n>

<script setup lang="ts">
import { computed } from 'vue';
import type { ItemFile } from '@etonee123x/shared/helpers/folderData';
import { useDateFns } from '@/composables/useDateFns';
import type { WithMeta, WithSinceTimestamps } from '@etonee123x/shared/types/database';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  element: ItemFile & WithMeta<WithSinceTimestamps>;
}>();

const emit = defineEmits<{
  click: [];
}>();

const { t } = useI18n({ useScope: 'local' });

const onClick = () => emit('click');

const { intlFormatDistanceToNow } = useDateFns();

const sinceCreated = computed(() => intlFormatDistanceToNow(props.element._meta.sinceCreated, { numeric: 'always' }));
const createdAtISO = computed(() => new Date(props.element._meta.createdAt).toISOString());
</script>

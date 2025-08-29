<template>
  <RouterLink :to="element.url" class="explorer-element">
    <article>
      <header class="flex justify-between">
        <div class="explorer-element__title">
          {{ element.name }}
        </div>
        <time
          :datetime="relativeDatetimeFormats.forMachine.value"
          :title="t('createdAt', { at: relativeDatetimeFormats.forMachine.value })"
          class="text-right m-2"
        >
          {{ relativeDatetimeFormats.forHuman.value }}
        </time>
      </header>
      <hr />
      <div class="p-2">
        <slot />
      </div>
    </article>
  </RouterLink>
</template>

<i18n lang="yaml">
En:
  createdAt: 'Created at { at }'
Ru:
  createdAt: 'Создано в { at }'
</i18n>

<script setup lang="ts">
import type { ItemFile } from '@etonee123x/shared/helpers/folderData';

import type { WithMeta, WithSinceTimestamps } from '@etonee123x/shared/types/database';
import { useI18n } from 'vue-i18n';
import { useRelativeDatetimeFormats } from '@/composables/useRelativeDatetimeFormats';

const props = defineProps<{
  element: ItemFile & WithMeta<WithSinceTimestamps>;
}>();

const { t } = useI18n({ useScope: 'local' });

const relativeDatetimeFormats = useRelativeDatetimeFormats(() => -props.element._meta.sinceCreated);
</script>

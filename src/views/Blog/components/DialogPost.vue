<template>
  <BaseDialog is-hidden-header :model-value="Boolean(postSelected)" height="min-content" @close="onDialogClose">
    <LazyPostData v-if="postSelected" :post="postSelected" />
    <template #footer>
      <PostDataFooter v-if="postSelected" :post="postSelected">
        <div class="text-sm" :class="$style.dates">
          <div>{{ t('createdAt', { date: dates.createdAt }) }}</div>
          <div v-if="wasEdited">{{ t('updatedAt', { date: dates.updatedAt }) }}</div>
        </div>
      </PostDataFooter>
    </template>
  </BaseDialog>
</template>

<i18n lang="yaml">
En:
  createdAt: 'Created at: { date }'
  updatedAt: 'Edited at: { date }'
Ru:
  createdAt: 'Создано: { date }'
  updatedAt: 'Изменено: { date }'
</i18n>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import PostDataFooter from './PostDataFooter.vue';

import BaseDialog from '@/components/ui/BaseDialog.vue';
import { useBlogStore } from '@/stores/blog';
import { wasEdited as _wasEdited } from '@/utils';
import { useDateFns } from '@/composables/useDateFns';

const LazyPostData = defineAsyncComponent(() => import('./PostData.vue'));

const FORMAT_TEMPALTE = 'PPp';

const { t } = useI18n({ useScope: 'local' });

const blogStore = useBlogStore();
const { postSelected } = storeToRefs(blogStore);

const { format } = useDateFns();

const onDialogClose = () => {
  postSelected.value = null;
};

const dates = computed(() =>
  postSelected.value
    ? {
        createdAt: format.value(postSelected.value.createdAt, FORMAT_TEMPALTE),
        updatedAt: format.value(postSelected.value.updatedAt, FORMAT_TEMPALTE),
      }
    : {
        createdAt: null,
        updatedAt: null,
      },
);

const wasEdited = computed(() => Boolean(postSelected.value && _wasEdited(postSelected.value)));
</script>

<style lang="scss" module>
.dates {
  color: var(--color-dark);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.content {
  overflow-y: auto;
}
</style>

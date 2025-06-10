<template>
  <BaseDialog isHiddenHeader style="height: min-content" ref="baseDialog" @close="onDialogClose">
    <LazyPostData v-if="blogStore.byId" :post="blogStore.byId" />
    <template #footer>
      <PostDataFooter v-if="blogStore.byId" :post="blogStore.byId">
        <div class="text-sm text-dark flex flex-col items-end">
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
import { computed, defineAsyncComponent, useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import PostDataFooter from './PostDataFooter.vue';

import BaseDialog from '@/components/ui/BaseDialog.vue';
import { useBlogStore } from '@/stores/blog';
import { wasEdited as _wasEdited } from '../helpers/wasEdited';
import { useDateFns } from '@/composables/useDateFns';
import { RouteName } from '@/router';

const LazyPostData = defineAsyncComponent(() => import('./PostData.vue'));

const FORMAT_TEMPALTE = 'PPp';

const { t } = useI18n({ useScope: 'local' });

const router = useRouter();

const blogStore = useBlogStore();

const { format } = useDateFns();

const baseDialog = useTemplateRef('baseDialog');

const dates = computed(() =>
  blogStore.byId
    ? {
        createdAt: format.value(blogStore.byId.createdAt, FORMAT_TEMPALTE),
        updatedAt: format.value(blogStore.byId.updatedAt, FORMAT_TEMPALTE),
      }
    : {
        createdAt: null,
        updatedAt: null,
      },
);

const wasEdited = computed(() => Boolean(blogStore.byId && _wasEdited(blogStore.byId)));

const onDialogClose = () => {
  router.push({ name: RouteName.Blog });
};

watch(
  () => blogStore.byId,
  () => (blogStore.byId ? baseDialog.value?.open() : baseDialog.value?.close()),
);
</script>

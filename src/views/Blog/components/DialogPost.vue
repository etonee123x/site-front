<template>
  <BaseDialog ref="refBaseDialog" is-hidden-header style="height: min-content" @close="onDialogClose">
    <LazyPostData v-if="postSelected" :post="postSelected" />
    <template #footer>
      <PostDataFooter v-if="postSelected" :post="postSelected">
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
import { storeToRefs } from 'pinia';
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import PostDataFooter from './PostDataFooter.vue';

import BaseDialog from '@/components/ui/BaseDialog.vue';
import { useBlogStore } from '@/stores/blog';
import { wasEdited as _wasEdited } from '@/utils/post';
import { useDateFns } from '@/composables/useDateFns';
import { RouteName } from '@/router';

const LazyPostData = defineAsyncComponent(() => import('./PostData.vue'));

const FORMAT_TEMPALTE = 'PPp';

const { t } = useI18n({ useScope: 'local' });

const router = useRouter();

const blogStore = useBlogStore();
const { postSelected } = storeToRefs(blogStore);

const { format } = useDateFns();

const refBaseDialog = ref<InstanceType<typeof BaseDialog>>();

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

const onDialogClose = () => {
  router.push({ name: RouteName.Blog });
};

watch(postSelected, () => {
  if (postSelected.value) {
    refBaseDialog.value?.open();
  } else {
    refBaseDialog.value?.close();
  }
});
</script>

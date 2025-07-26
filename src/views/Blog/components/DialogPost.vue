<template>
  <BaseDialog isHiddenHeader ref="baseDialog" v-model="isDialogOpen" @close="onDialogClose">
    <PostData
      v-if="blogStore.byId"
      class="max-w-full w-full h-full max-h-[calc(90dvh_-2*4*var(--spacing)_-6*var(--spacing)_-2*var(--spacing))] overflow-y-auto"
      :post="blogStore.byId"
    />
    <template #footer>
      <div class="sticky bottom-0 -mb-4 py-4 bg-background text-sm text-dark flex flex-col items-end">
        <ClientOnly>
          <div>{{ t('createdAt', { since: sinceCreated }) }}</div>
          <div v-if="sinceUpdated">{{ t('updatedAt', { since: sinceUpdated }) }}</div>
        </ClientOnly>
      </div>
    </template>
  </BaseDialog>
</template>

<i18n lang="yaml">
En:
  createdAt: 'Created { since }'
  updatedAt: 'Edited { since }'
Ru:
  createdAt: 'Создано { since }'
  updatedAt: 'Изменено { since }'
</i18n>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import BaseDialog from '@/components/ui/BaseDialog.vue';
import { useBlogStore } from '@/stores/blog';
import { useDateFns } from '@/composables/useDateFns';
import { RouteName } from '@/router';
import { useToggle } from '@vueuse/core';
import PostData from './PostData.vue';
import ClientOnly from '@/components/ClientOnly.vue';
import { isNotNil } from '@etonee123x/shared/utils/isNotNil';

const { t } = useI18n({ useScope: 'local' });

const router = useRouter();

const blogStore = useBlogStore();

const { intlFormatDistanceToNow } = useDateFns();

const [isDialogOpen, toggleIsDialogOpen] = useToggle(Boolean(blogStore.byId));

const sinceCreated = computed(() => blogStore.byId && intlFormatDistanceToNow(blogStore.byId._meta.sinceCreated));
const sinceUpdated = computed(
  () => isNotNil(blogStore.byId?._meta.sinceUpdated) && intlFormatDistanceToNow(blogStore.byId._meta.sinceUpdated),
);

const onDialogClose = () => {
  router.push({ name: RouteName.Blog });
};

watch(
  () => blogStore.byId,
  () => toggleIsDialogOpen(Boolean(blogStore.byId)),
);
</script>

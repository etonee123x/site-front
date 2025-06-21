<template>
  <div
    class="w-full bg-background border border-dark rounded-sm cursor-pointer shadow-lg shadow-dark/15"
    ref="root"
    @click="onClick"
  >
    <div class="p-4 flex flex-col">
      <LazyBlogEditPost
        v-if="isInEditMode"
        :v$
        ref="blogEditPost"
        v-model="postNew"
        v-model:files="files"
        @keydown:enter="onKeyDownEnter"
      />
      <template v-else>
        <PostData :post />
        <PostDataFooter :post class="mt-4">
          <span class="text-sm text-dark flex items-center gap-0.5" :title="dateExact">
            <span>{{ createdAtHumanReadable }}</span>
            <BaseIcon v-if="wasEdited" :class="ICON.SIZE.SM" :path="mdiPencil" />
          </span>
        </PostDataFooter>
      </template>
    </div>
    <div v-if="authStore.isAdmin" class="flex justify-end border-t border-t-dark p-1 gap-2">
      <LazyBaseButton
        v-for="control in controls"
        class="p-0.5"
        :isLoading="control.isLoading"
        :isDisabled="control.isDisabled"
        :key="control.id"
        @click.stop="control.onClick"
      >
        <BaseIcon class="text-2xl" :path="control.iconPath" />
      </LazyBaseButton>
    </div>
  </div>
</template>

<i18n lang="yaml">
En:
  updatedAt: 'Edited at: { date }'
  confirmDelete: 'Delete Post'
  deleteMessage: 'Are you sure you want to delete this post?'
Ru:
  updatedAt: 'Изменено: { date }'
  confirmDelete: 'Удалить пост'
  deleteMessage: 'Вы уверены, что хотите удалить этот пост?'
</i18n>

<script setup lang="ts">
import deepEqual from 'deep-equal';
import { mdiCancel, mdiContentSave, mdiDelete, mdiPencil } from '@mdi/js';
import type { Post } from '@etonee123x/shared/types/blog';
import { areIdsEqual } from '@etonee123x/shared/helpers/id';
import { computed, ref, nextTick, defineAsyncComponent, useTemplateRef } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

import PostData from './PostData.vue';
import PostDataFooter from './PostDataFooter.vue';

import BaseIcon from '@/components/ui/BaseIcon';
import { useDateFns } from '@/composables/useDateFns';
import { clone } from '@/utils/clone';
import { wasEdited as _wasEdited } from '../helpers/wasEdited';
import { useBlogStore } from '@/stores/blog';
import { useVuelidateBlogPostData } from '../composables/useVuelidateBlogPostData';
import { useAuthStore } from '@/stores/auth';
import { RouteName, router } from '@/router';
import { ICON } from '@/helpers/ui';
import { onPostTextareaKeyDownEnter } from '../helpers/onPostTextareaKeyDownEnter';

const LazyBlogEditPost = defineAsyncComponent(() => import('./BlogEditPost.vue'));
const LazyBaseButton = defineAsyncComponent(() => import('@/components/ui/BaseButton'));

const getInitialPostNew = () => clone(props.post);

const props = defineProps<{
  post: Post;
  onBeforeDelete: () => Promise<boolean>;
}>();

const root = useTemplateRef('root');
const blogEditPost = useTemplateRef('blogEditPost');

onClickOutside(root, () => {
  if (!isInEditMode.value) {
    return;
  }

  closeEditMode();
});

const blogStore = useBlogStore();

const authStore = useAuthStore();

const { t } = useI18n({ useScope: 'local' });

const files = ref<Array<File>>([]);

const postNew = ref(getInitialPostNew());

const { intlFormatDistance } = useDateFns();

const { v$, handle } = useVuelidateBlogPostData(
  async () => {
    if (hasChanges.value) {
      blogStore.putById(props.post.id, postNew.value, files.value).then(() => blogStore.getAll({ shouldReset: true }));
    }

    closeEditMode();
  },
  postNew,
  files,
);

const dateExact = computed(() =>
  [
    String(new Date(props.post.createdAt)),
    ...(wasEdited.value ? [t('updatedAt', { date: String(new Date(props.post.updatedAt)) })] : []),
  ].join('\n'),
);
const createdAtHumanReadable = computed(() => intlFormatDistance.value(props.post.createdAt, new Date()));

const isInEditMode = computed(() => areIdsEqual(blogStore.editModeFor, props.post.id));

const wasEdited = computed(() => _wasEdited(props.post));

const onKeyDownEnter = onPostTextareaKeyDownEnter(handle);

const hasChanges = computed(() => !deepEqual(props.post, postNew.value));

const closeEditMode = () => {
  blogStore.editModeFor = null;
};

const controls = computed(() => [
  ...(isInEditMode.value
    ? [
        {
          id: 0,
          iconPath: mdiCancel,
          isLoading: false,
          onClick: closeEditMode,
        },
        {
          id: 1,
          iconPath: mdiContentSave,
          isDisabled: !hasChanges.value,
          isLoading: blogStore.isLoadingPutById,
          onClick: handle,
        },
      ]
    : []),
  // TODO: Надо придумать как редактировать посты с вложениями...
  ...(!(isInEditMode.value || props.post.filesUrls.length)
    ? [
        {
          id: 2,
          iconPath: mdiPencil,
          isLoading: blogStore.isLoadingPutById,
          onClick: () => {
            blogStore.editModeFor = props.post.id;

            nextTick(() => blogEditPost.value?.focusTextarea());
          },
        },
      ]
    : []),
  {
    id: 3,
    iconPath: mdiDelete,
    isLoading: blogStore.isLoadingDeleteById,
    onClick: async () => {
      if (!(await props.onBeforeDelete())) {
        return;
      }

      return blogStore.deleteById(props.post.id).then(() => blogStore.getAll({ shouldReset: true }));
    },
  },
]);

const onClick = () => {
  if (isInEditMode.value) {
    return;
  }

  router.push({
    name: RouteName.BlogPost,
    params: {
      postId: props.post.id,
    },
  });
};
</script>

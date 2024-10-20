<template>
  <div class="w-full border border-dark rounded cursor-pointer" ref="refRoot" @click="onClick">
    <div class="p-4 flex flex-col">
      <LazyBlogEditPost
        v-if="isInEditMode"
        :v$
        ref="refBlogEditPost"
        v-model="postNew"
        v-model:files="files"
        @submit="onSubmit"
      />
      <template v-else>
        <PostData :post />
        <PostDataFooter :post @click.stop>
          <span class="text-sm text-dark flex items-center gap-0.5" :title="dateExact">
            <span>{{ createdAtHumanReadable }}</span>
            <BaseIcon v-if="wasEdited" :path="mdiPencil" />
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
  <DialogConfirmation
    :title="t('confirmDelete')"
    :message="t('deleteMessage')"
    ref="refDialogConfirmation"
    @confirm="confirm"
    @cancel="cancel"
    @close="cancel"
  />
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
import { areIdsEqual, type Post } from '@shared/src/types';
import { computed, ref, nextTick, defineAsyncComponent } from 'vue';
import { isNotEmptyArray, isTruthy } from '@shared/src/utils';
import { onClickOutside, useConfirmDialog } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

import PostData from './PostData.vue';
import PostDataFooter from './PostDataFooter.vue';

import BaseIcon from '@/components/ui/BaseIcon';
import DialogConfirmation from '@/components/DialogConfirmation.vue';
import { useDateFns } from '@/composables/useDateFns';
import { clone } from '@/utils/clone';
import { addId } from '@/utils/addId';
import { wasEdited as _wasEdited } from '@/utils/post';
import { useBlogStore } from '@/stores/blog';
import { useVuelidateBlogPostData } from '@/views/Blog/composables';
import { useAuthStore } from '@/stores/auth';
import { RouteName, router } from '@/router';

const LazyBlogEditPost = defineAsyncComponent(() => import('./BlogEditPost.vue'));
const LazyBaseButton = defineAsyncComponent(() => import('@/components/ui/BaseButton'));

const getInitialPostNew = () => clone(props.post);

const props = defineProps<{
  post: Post;
}>();

const { reveal, confirm, cancel } = useConfirmDialog();

const refRoot = ref<HTMLDivElement>();
const refBlogEditPost = ref<InstanceType<typeof LazyBlogEditPost>>();
const refDialogConfirmation = ref<InstanceType<typeof DialogConfirmation>>();

onClickOutside(refRoot, () => {
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
    wasEdited.value && t('updatedAt', { date: String(new Date(props.post.updatedAt)) }),
  ]
    .filter(isTruthy)
    .join('\n'),
);
const createdAtHumanReadable = computed(() => intlFormatDistance.value(props.post.createdAt, new Date()));

const isInEditMode = computed(() => areIdsEqual(blogStore.editModeFor, props.post.id));

const wasEdited = computed(() => _wasEdited(props.post));

const onSubmit = handle;

const hasChanges = computed(() => !deepEqual(props.post, postNew.value));

const closeEditMode = () => {
  blogStore.editModeFor = null;
};

const controls = computed(() =>
  [
    ...(isInEditMode.value
      ? [
          {
            iconPath: mdiCancel,
            isLoading: false,
            onClick: closeEditMode,
          },
          {
            iconPath: mdiContentSave,
            isDisabled: !hasChanges.value,
            isLoading: blogStore.isLoadingPutById,
            onClick: handle,
          },
        ]
      : []),
    // TODO: Надо придумать как редактировать посты с вложениями...
    ...(!(isInEditMode.value || isNotEmptyArray(props.post.filesUrls))
      ? [
          {
            iconPath: mdiPencil,
            isLoading: blogStore.isLoadingPutById,
            onClick: () => {
              blogStore.editModeFor = props.post.id;

              nextTick(() => refBlogEditPost.value?.focusTextarea());
            },
          },
        ]
      : []),
    {
      iconPath: mdiDelete,
      isLoading: blogStore.isLoadingDeleteById,
      onClick: async () => {
        refDialogConfirmation.value?.open();

        const { isCanceled } = await reveal();

        if (isCanceled) {
          return;
        }

        return blogStore.deleteById(props.post.id).then(() => blogStore.getAll({ shouldReset: true }));
      },
    },
  ].map(addId),
);

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

<template>
  <component
    :is="component.Is"
    v-bind="component.binds"
    class="w-full bg-background border border-dark rounded-sm cursor-pointer shadow-lg shadow-dark/15 hover:text-[initial]"
  >
    <div class="p-4 flex flex-col">
      <LazyBlogEditPost
        v-if="isInEditMode"
        :v$
        ref="blogEditPost"
        v-model="model"
        v-model:files="files"
        @keydown:enter="onKeyDownEnter"
      />
      <template v-else>
        <PostData :post />
        <span class="text-sm mt-4 text-dark flex justify-end items-center gap-0.5" :title="dateExact">
          <ClientOnly>
            {{ createdAtHumanReadable }}
            <template #fallback>
              {{ createdAtHumanReadable }}
            </template>
          </ClientOnly>
          <BaseIcon v-if="wasEdited" :class="ICON.SIZE.SM" :path="mdiPencil" />
        </span>
      </template>
    </div>
    <div v-if="authStore.isAdmin" class="flex justify-end border-t border-t-dark p-1 gap-2">
      <BaseButton
        v-for="control in controls"
        class="p-0.5"
        :isLoading="control.isLoading"
        :isDisabled="control.isDisabled"
        :key="control.key"
        @click.stop.prevent="control.onClick"
      >
        <BaseIcon class="text-2xl" :path="control.iconPath" />
      </BaseButton>
    </div>
  </component>
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
import { useI18n } from 'vue-i18n';

import PostData from './PostData.vue';

import BaseIcon from '@/components/ui/BaseIcon';
import { useDateFns } from '@/composables/useDateFns';
import { wasEdited as _wasEdited } from '../helpers/wasEdited';
import { useBlogStore } from '@/stores/blog';
import { useVuelidatePostData } from '../composables/useVuelidatePostData';
import { useAuthStore } from '@/stores/auth';
import { RouteName } from '@/router';
import { ICON } from '@/helpers/ui';
import { onPostTextareaKeyDownEnter } from '../helpers/onPostTextareaKeyDownEnter';
import { RouterLink } from 'vue-router';
import { useSourcedRef } from '@/composables/useSourcedRef';
import BaseButton from '@/components/ui/BaseButton';
import ClientOnly from '@/components/ClientOnly.vue';

const LazyBlogEditPost = defineAsyncComponent(() => import('./BlogEditPost.vue'));

const props = defineProps<{
  post: Post;
  onBeforeDelete: () => Promise<boolean>;
}>();

const blogEditPost = useTemplateRef('blogEditPost');

const blogStore = useBlogStore();

const authStore = useAuthStore();

const { t } = useI18n({ useScope: 'local' });

const files = ref<Array<File>>([]);

const [model] = useSourcedRef(() => props.post, { isAutoSynced: true });

const { intlFormatDistance } = useDateFns();

const { v$ } = useVuelidatePostData(model, files);

const onSubmit = async () => {
  if (!(await v$.value.$validate())) {
    return;
  }

  if (hasChanges.value) {
    blogStore.putById(props.post.id, model.value, files.value).then(() => blogStore.getAll({ shouldReset: true }));
  }

  closeEditMode();
  v$.value.$reset();
};

const component = computed(() =>
  isInEditMode.value
    ? {
        Is: 'div',
      }
    : {
        Is: RouterLink,
        binds: {
          to: {
            name: RouteName.BlogPost,
            params: {
              postId: props.post.id,
            },
          },
        },
      },
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

const onKeyDownEnter = onPostTextareaKeyDownEnter(onSubmit);

const hasChanges = computed(() => !deepEqual(props.post, model.value));

const closeEditMode = () => {
  blogStore.editModeFor = null;
};

const controls = computed(() => [
  ...(isInEditMode.value
    ? [
        {
          key: 'cancel',
          iconPath: mdiCancel,
          isLoading: false,
          onClick: closeEditMode,
        },
        {
          key: 'save',
          iconPath: mdiContentSave,
          isDisabled: !hasChanges.value,
          isLoading: blogStore.isLoadingPutById,
          onClick: onSubmit,
        },
      ]
    : []),
  // TODO: Надо придумать как редактировать посты с вложениями...
  ...(!(isInEditMode.value || props.post.filesUrls.length)
    ? [
        {
          key: 'edit',
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
    key: 'delete',
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
</script>

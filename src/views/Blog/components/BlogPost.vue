<template>
  <div ref="refRoot" :class="$style.post" @click="onClick">
    <div :class="$style.postInner">
      <template v-if="!isInEditMode">
        <PostData :post="post" />
        <span class="text-sm" :class="$style.createdAt" :title="dateExact" @click="onClickDate">
          <span>{{ createdAtHumanReadable }}</span>
          <BaseIcon v-if="wasEdited" :path="mdiPencil" />
        </span>
      </template>
      <BlogEditPost v-else ref="refBlogEditPost" v-model="postNew" v-model:files="files" :v$="v$" @submit="onSubmit" />
    </div>
    <div v-if="isAdmin" :class="$style.controls">
      <BaseButton
        v-for="control in controls"
        :key="control.id"
        :class="$style.control"
        :is-loading="control.isLoading"
        :is-disabled="control.isDisabled"
        @click.stop="control.onClick"
      >
        <BaseIcon class="text-2xl" :path="control.iconPath" />
      </BaseButton>
    </div>
  </div>
</template>

<i18n lang="yaml">
En:
  copied: 'Copied!'
  updatedAt: 'Edited at: { date }'
Ru:
  copied: 'Скопировано!'
  updatedAt: 'Изменено: { date }'
</i18n>

<script setup lang="ts">
import deepEqual from 'deep-equal';
import { mdiCancel, mdiContentSave, mdiDelete, mdiPencil } from '@mdi/js';
import { areIdsEqual, type Post } from '@shared/src/types';
import { computed, ref, nextTick } from 'vue';
import { isNotEmptyArray, isTruthy } from '@shared/src/utils';
import { onClickOutside, useClipboard } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';

import PostData from './PostData.vue';

import BlogEditPost from '@/views/Blog/components/BlogEditPost.vue';
import { useDateFns } from '@/composables';
import { useToastsStore, useBlogStore } from '@/stores';
import { clone, addId, wasEdited as _wasEdited } from '@/utils';
import { BaseButton, BaseIcon } from '@/components/ui';
import { IsLoadingAction } from '@/stores/blog';
import { useVuelidateBlogPostData } from '@/views/Blog/composables';

const getInitialPostNew = () => clone(props.post);

const refRoot = ref<HTMLDivElement>();
const refBlogEditPost = ref<InstanceType<typeof BlogEditPost>>();

const props = defineProps<{
  post: Post;
}>();

onClickOutside(refRoot, () => {
  if (!isInEditMode.value) {
    return;
  }

  closeEditMode();
});

const blogStore = useBlogStore();
const { isAdmin, isLoading, editModeFor, postSelected } = storeToRefs(blogStore);

const { t } = useI18n({ useScope: 'local' });

const files = ref<Array<File>>([]);

const postNew = ref(getInitialPostNew());

const toastsStore = useToastsStore();

const { intlFormatDistance } = useDateFns();

const { v$, handle } = useVuelidateBlogPostData(async () => {
  if (hasChanges.value) {
    blogStore.putPost(props.post.id, postNew.value, files.value);
  }

  closeEditMode();
}, postNew);

const dateExact = computed(() =>
  [
    String(new Date(props.post.createdAt)),
    wasEdited.value && t('updatedAt', { date: String(new Date(props.post.updatedAt)) }),
  ]
    .filter(isTruthy)
    .join('\n'),
);
const createdAtHumanReadable = computed(() => intlFormatDistance.value(props.post.createdAt, new Date()));

const isInEditMode = computed(() => areIdsEqual(editModeFor.value, props.post.id));

const wasEdited = computed(() => _wasEdited(props.post));

const source = ref<string>('');

const { copy } = useClipboard({ source, legacy: true });

const onClickDate = () => {
  source.value = [window.location.origin, window.location.pathname, `/${props.post.id}`].join('');
  copy().then(() => toastsStore.toastSuccess(t('copied')));
};

const onSubmit = handle;

const hasChanges = computed(() => !deepEqual(props.post, postNew.value));

const closeEditMode = () => {
  editModeFor.value = null;
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
            isLoading: isLoading.value[IsLoadingAction.Put],
            onClick: handle,
          },
        ]
      : []),
    // Надо придумать как редактировать посты с вложениями...
    ...(!(isInEditMode.value || isNotEmptyArray(props.post.filesUrls))
      ? [
          {
            iconPath: mdiPencil,
            isLoading: isLoading.value[IsLoadingAction.Put],
            onClick: () => {
              editModeFor.value = props.post.id;

              nextTick(() => refBlogEditPost.value?.focus());
            },
          },
        ]
      : []),
    {
      iconPath: mdiDelete,
      isLoading: isLoading.value[IsLoadingAction.Delete],
      onClick: () => blogStore.deletePost(props.post.id),
    },
  ].map(addId),
);

const onClick = () => {
  if (isInEditMode.value) {
    return;
  }

  postSelected.value = props.post;
};
</script>

<style lang="scss" module>
.post {
  width: 100%;
  border: 1px solid var(--color-dark);
  border-radius: 0.25rem;
  cursor: pointer;
}

.postInner {
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.createdAt {
  color: var(--color-dark);
  align-self: flex-end;
  cursor: default;
  display: flex;
  align-items: center;
  gap: 0.125rem;
}

.controls {
  display: flex;
  justify-content: end;
  border-top: 1px solid var(--color-dark);
  padding: 0.25rem;
  gap: 0.5rem;
}

.control {
  padding: 0.125rem;
}
</style>

<template>
  <div class="layout-container mx-auto pt-2 flex flex-col">
    <DialogPost />
    <template v-if="authStore.isAdmin">
      <LazyBaseForm class="flex flex-col gap-4" ref="baseForm" @submit.prevent="onSubmit">
        <LazyBlogEditPost
          :v$
          ref="lazyBlogEditPost"
          v-model="postData"
          v-model:files="files"
          @keydown:enter="onKeyDownEnter"
        />
        <LazyBaseButton type="submit" :isLoading="blogStore.isLoadingPost">
          {{ t('send') }}
        </LazyBaseButton>
      </LazyBaseForm>
      <hr v-if="hasPosts" class="my-4" />
    </template>
    <LazyBaseLoading
      v-if="blogStore.isLoadingGetAll && !hasPosts"
      isFull
      class="flex justify-center items-center flex-1"
    />
    <template v-else>
      <template v-if="hasPosts">
        <div class="flex flex-col gap-4 mb-4">
          <BlogPost v-for="post in blogStore.all" :post :onBeforeDelete :key="post.id" />
        </div>
        <LazyBaseLoading v-if="blogStore.isLoadingGetAll" isFull class="flex justify-center m-4" />
      </template>
      <div v-else class="text-lg flex justify-center items-center flex-1">
        {{ t('nothingWasFound') }}
      </div>
    </template>

    <DialogConfirmation
      :title="t('confirmDelete')"
      :message="t('deleteMessage')"
      ref="dialogConfirmationDelete"
      @confirm="confirm"
      @cancel="cancel"
      @close="cancel"
    />
  </div>
</template>

<i18n lang="yaml">
En:
  send: 'Send'
  nothingWasFound: 'Nothing was found...'
  confirmDelete: 'Delete Post'
  deleteMessage: 'Are you sure you want to delete this post?'
Ru:
  send: 'Отправить'
  nothingWasFound: 'Ничего не найдено...'
  confirmDelete: 'Удалить пост'
  deleteMessage: 'Вы уверены, что хотите удалить этот пост?'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useConfirmDialog, useInfiniteScroll } from '@vueuse/core';
import { defineAsyncComponent, computed, useTemplateRef, watch, onServerPrefetch } from 'vue';
import { useRoute } from 'vue-router';
import { toId } from '@etonee123x/shared/helpers/id';

import DialogPost from './components/DialogPost.vue';
import BlogPost from './components/BlogPost.vue';

import { useBlogStore } from '@/stores/blog';
import { useVuelidatePostData } from './composables/useVuelidatePostData';
import { useAuthStore } from '@/stores/auth';
import { goToPage404 } from '@/composables/goToPage404';
import { MAIN } from '@/constants/selectors';
import { useElementFinder } from '@/composables/useElementFinder';
import DialogConfirmation from '@/components/DialogConfirmation.vue';
import { useResetableRef } from '@/composables/useResetableRef';
import { onPostTextareaKeyDownEnter } from './helpers/onPostTextareaKeyDownEnter';
import { isNotNil } from '@etonee123x/shared/utils/isNotNil';
import { isServer } from '@/constants/target';
import { clientOnly } from '@/helpers/clientOnly';

const LazyBaseForm = defineAsyncComponent(() => import('@/components/ui/BaseForm.vue'));
const LazyBaseButton = defineAsyncComponent(() => import('@/components/ui/BaseButton'));
const LazyBaseLoading = defineAsyncComponent(() => import('@/components/ui/BaseLoading.vue'));

const LazyBlogEditPost = defineAsyncComponent(() => import('./components/BlogEditPost.vue'));

const dialogConfirmationDelete = useTemplateRef('dialogConfirmationDelete');
const baseForm = useTemplateRef('baseForm');
const lazyBlogEditPost = useTemplateRef('lazyBlogEditPost');

const { reveal, confirm, cancel } = useConfirmDialog();

const { t } = useI18n({ useScope: 'local' });

const route = useRoute();

const blogStore = useBlogStore();

const authStore = useAuthStore();

const hasPosts = computed(() => Boolean(blogStore.all.length));

const elementMain = useElementFinder(() => document.getElementById(MAIN));

useInfiniteScroll(elementMain, () => blogStore.getAll().then(() => undefined), {
  canLoadMore: () => !blogStore.isEnd,
  distance: 100,
});

const [files, resetFiles] = useResetableRef<Array<File>>([]);

const [postData, resetPostModel] = useResetableRef(() => ({
  text: '',
  filesUrls: [],
}));

const { v$ } = useVuelidatePostData(postData, files);

const onSubmit = async () => {
  if (!(await v$.value.$validate())) {
    return;
  }

  blogStore.post(postData.value, files.value).then(() => blogStore.getAll({ shouldReset: true }));

  v$.value.$reset();
  resetFiles();
  resetPostModel();

  lazyBlogEditPost.value?.focusTextarea();
};

const onKeyDownEnter = onPostTextareaKeyDownEnter(() => baseForm.value?.requestSubmit());

const onBeforeDelete = async () => {
  dialogConfirmationDelete.value?.open();

  const { isCanceled } = await reveal();

  return !isCanceled;
};

const fetchData = () =>
  Promise.all([
    ...(isServer ? [blogStore.getAll()] : []),
    ...(isNotNil(route.params.postId)
      ? [
          //
          blogStore.getById(toId(String(route.params.postId))).catch(goToPage404),
        ]
      : []),
  ]);

onServerPrefetch(fetchData);
clientOnly(fetchData);

if (!isServer) {
  watch(
    () => route.params.postId,
    async () => {
      if (isNotNil(route.params.postId)) {
        await blogStore.getById(toId(String(route.params.postId)));

        return;
      }

      blogStore.byId = undefined;
    },
  );
}
</script>

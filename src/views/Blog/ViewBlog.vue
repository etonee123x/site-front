<template>
  <BasePage :h1="t('blog')" class="mx-auto">
    <template v-if="authStore.isAdmin">
      <LazyBaseForm class="flex flex-col gap-4" ref="baseForm" @submit.prevent="onSubmit">
        <LazyBlogEditPost
          :v$
          ref="lazyBlogEditPost"
          v-model="postData"
          v-model:files="files"
          @keydown:enter="onKeyDownEnter"
        />
        <BaseButton type="submit" :isLoading="blogStore.isLoadingPost">
          {{ t('send') }}
        </BaseButton>
      </LazyBaseForm>
      <hr v-if="hasPosts" class="my-4" />
    </template>

    <template v-if="hasPosts">
      <BlogPost v-for="post in blogStore.all" class="not-last:mb-4" :post :onBeforeDelete :key="post._meta.id" />
    </template>
    <div v-else-if="!blogStore.isLoadingGetAll" class="text-lg flex justify-center items-center flex-1 h-full">
      {{ t('nothingWasFound') }}
    </div>
    <LazyBaseLoading v-if="blogStore.isLoadingGetAll" isFull class="flex justify-center" />

    <DialogConfirmation
      :title="t('confirmDelete')"
      :message="t('deleteMessage')"
      ref="dialogConfirmationDelete"
      @confirm="confirm"
      @cancel="cancel"
      @close="cancel"
    />

    <DialogPost />
  </BasePage>
</template>

<i18n lang="yaml">
En:
  blog: 'Blog'
  send: 'Send'
  nothingWasFound: 'Nothing was found...'
  confirmDelete: 'Delete Post'
  deleteMessage: 'Are you sure you want to delete this post?'
  microblogWithNoClearDirection: 'Microblog with no clear direction. Something from thoughts, something random. Everything is combined into one feed.'
  myBlog: 'My blog. Post.'
Ru:
  blog: 'Блог'
  send: 'Отправить'
  nothingWasFound: 'Ничего не найдено...'
  confirmDelete: 'Удалить пост'
  deleteMessage: 'Вы уверены, что хотите удалить этот пост?'
  microblogWithNoClearDirection: 'Микроблог без чёткой направленности. Что-то из мыслей, что-то случайное. Всё складывается в одну ленту'
  myBlog: 'Мой блог. Пост.'
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
import { useGoToPage404 } from '@/composables/useGoToPage404';
import { MAIN } from '@/constants/selectors';
import { useElementFinder } from '@/composables/useElementFinder';
import DialogConfirmation from '@/components/DialogConfirmation.vue';
import { onPostTextareaKeyDownEnter } from './helpers/onPostTextareaKeyDownEnter';
import { isNotNil } from '@etonee123x/shared/utils/isNotNil';
import { isServer } from '@/constants/target';
import { clientOnly } from '@/helpers/clientOnly';
import BaseButton from '@/components/ui/BaseButton';
import { useSourcedRef } from '@/composables/useSourcedRef';
import type { Post } from '@etonee123x/shared/types/blog';
import type { ForPost } from '@etonee123x/shared/types/database';
import BasePage from '@/components/ui/BasePage.vue';
import { useSeoMeta } from '@unhead/vue';

const LazyBaseForm = defineAsyncComponent(() => import('@/components/ui/BaseForm.vue'));
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

const goToPage404 = useGoToPage404();

useInfiniteScroll(elementMain, () => blogStore.getAll().then(() => undefined), {
  canLoadMore: () => !(blogStore.isLoadingGetAll || blogStore.isEnd),
  distance: 100,
});

const [files, resetFiles] = useSourcedRef<Array<File>>([]);

const [postData, resetPostModel] = useSourcedRef<ForPost<Post>>(() => ({
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
    blogStore.getAll(),
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

useSeoMeta({
  description: () => (blogStore.byId ? t('myBlog') : t('microblogWithNoClearDirection')),
});
</script>

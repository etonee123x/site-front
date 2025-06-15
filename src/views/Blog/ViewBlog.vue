<template>
  <div class="layout-container mx-auto pt-2 h-full flex flex-col">
    <DialogPost />
    <template v-if="authStore.isAdmin || true">
      <LazyBaseForm class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <LazyBlogEditPost :v$ ref="lazyBlogEditPost" v-model="postData" v-model:files="files" @submit="onSubmit" />
        <LazyBaseButton :isLoading="blogStore.isLoadingPost" @click="onClickButton">
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
        <div class="flex flex-col gap-4 last:pb-4">
          <BlogPost v-for="post in blogStore.all" :post :onBeforeDelete :key="post.id" />
        </div>
        <LazyBaseLoading v-if="blogStore.isLoadingGetAll" isFull class="flex justify-center p-4" />
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
import { ref, defineAsyncComponent, watch, computed, useTemplateRef } from 'vue';
import { useRoute } from 'vue-router';
import { isNil } from '@etonee123x/shared/utils/isNil';
import { isNotEmptyArray } from '@etonee123x/shared/utils/isNotEmptyArray';
import { toId } from '@etonee123x/shared/helpers/id';

import DialogPost from './components/DialogPost.vue';
import BlogPost from './components/BlogPost.vue';

import { useBlogStore } from '@/stores/blog';
import { useVuelidateBlogPostData } from '@/views/Blog/composables';
import { useAuthStore } from '@/stores/auth';
import { goToPage404 } from '@/composables/goToPage404';
import { MAIN } from '@/constants/selectors';
import { useElementFinder } from '@/composables/useElementFinder';
import DialogConfirmation from '@/components/DialogConfirmation.vue';

const LazyBaseForm = defineAsyncComponent(() => import('@/components/ui/BaseForm.vue'));
const LazyBaseButton = defineAsyncComponent(() => import('@/components/ui/BaseButton'));
const LazyBaseLoading = defineAsyncComponent(() => import('@/components/ui/BaseLoading.vue'));

const LazyBlogEditPost = defineAsyncComponent(() => import('./components/BlogEditPost.vue'));

const dialogConfirmationDelete = useTemplateRef('dialogConfirmationDelete');

const { reveal, confirm, cancel } = useConfirmDialog();

const { t } = useI18n({ useScope: 'local' });

const route = useRoute();

const blogStore = useBlogStore();

const authStore = useAuthStore();

const hasPosts = computed(() => isNotEmptyArray(blogStore.all));

const elementMain = useElementFinder(() => document.getElementById(MAIN));

useInfiniteScroll(elementMain, () => new Promise((resolve) => blogStore.getAll().then(() => resolve())), {
  canLoadMore: () => !blogStore.isEnd,
  distance: 100,
});

const getInitialPostData = () => ({
  text: '',
  filesUrls: [],
});

const files = ref<Array<File>>([]);

const postData = ref(getInitialPostData());

const lazyBlogEditPost = useTemplateRef('lazyBlogEditPost');

const { v$, handle } = useVuelidateBlogPostData(
  () => {
    blogStore.post(postData.value, files.value).then(() => blogStore.getAll({ shouldReset: true }));

    v$.value.$reset();
    files.value = [];

    postData.value = getInitialPostData();

    lazyBlogEditPost.value?.focusTextarea();
  },
  postData,
  files,
);

const onSubmit = handle;
const onClickButton = handle;

const onBeforeDelete = async () => {
  dialogConfirmationDelete.value?.open();

  const { isCanceled } = await reveal();

  return !isCanceled;
};

watch(
  () => route.params.postId,
  () => {
    if (isNil(route.params.postId)) {
      blogStore.byId = null;

      return;
    }

    blogStore.getById(toId(String(route.params.postId))).catch(goToPage404);
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div class="l-container pt-2 h-full flex flex-col">
    <DialogPost />
    <template v-if="authStore.isAdmin">
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
        <ul class="flex flex-col gap-4 last:pb-4">
          <li v-for="post in blogStore.all" :key="post.id">
            <BlogPost :post />
          </li>
        </ul>
        <LazyBaseLoading v-if="blogStore.isLoadingGetAll" isFull class="flex justify-center p-4" />
      </template>
      <div v-else class="text-lg flex justify-center items-center flex-1">
        {{ t('nothingWasFound') }}
      </div>
    </template>
  </div>
</template>

<i18n lang="yaml">
En:
  send: 'Send'
  nothingWasFound: 'Nothing was found...'
Ru:
  send: 'Отправить'
  nothingWasFound: 'Ничего не найдено...'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useInfiniteScroll } from '@vueuse/core';
import { ref, defineAsyncComponent, watch, computed, useTemplateRef } from 'vue';
import { useRoute } from 'vue-router';
import { isNil, isNotEmptyArray } from '@shared/src/utils';
import { toId } from '@shared/src/types';

import DialogPost from './components/DialogPost.vue';
import BlogPost from './components/BlogPost.vue';

import { useBlogStore } from '@/stores/blog';
import { useComponentsStore } from '@/stores/components';
import { useVuelidateBlogPostData } from '@/views/Blog/composables';
import { useAuthStore } from '@/stores/auth';
import { goToPage404 } from '@/composables/goToPage404';

const LazyBaseForm = defineAsyncComponent(() => import('@/components/ui/BaseForm.vue'));
const LazyBaseButton = defineAsyncComponent(() => import('@/components/ui/BaseButton'));
const LazyBaseLoading = defineAsyncComponent(() => import('@/components/ui/BaseLoading.vue'));

const LazyBlogEditPost = defineAsyncComponent(() => import('./components/BlogEditPost.vue'));

const { t } = useI18n({ useScope: 'local' });

const route = useRoute();

const blogStore = useBlogStore();

const authStore = useAuthStore();

const componentsStore = useComponentsStore();

const hasPosts = computed(() => isNotEmptyArray(blogStore.all));

useInfiniteScroll(
  () => componentsStore.main,
  () => new Promise((resolve) => blogStore.getAll().then(() => resolve())),
  {
    canLoadMore: () => !blogStore.isEnd,
    distance: 100,
  },
);

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

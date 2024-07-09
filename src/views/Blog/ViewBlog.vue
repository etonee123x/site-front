<template>
  <div class="l-container pt-2 h-full flex flex-col">
    <DialogPost />
    <template v-if="isAdmin">
      <LazyBaseForm class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <LazyBlogEditPost
          ref="refLazyBlogEditPost"
          v-model="postData"
          v-model:files="files"
          :v$="v$"
          @submit="onSubmit"
        />
        <LazyBaseButton :is-loading="isLoading[IsLoadingAction.Post]" @click="onClickButton">
          {{ t('send') }}
        </LazyBaseButton>
      </LazyBaseForm>
      <LazyBaseHr v-if="hasPosts" class="my-4" />
    </template>
    <LazyBaseLoading
      v-if="isLoading[IsLoadingAction.Get] && !hasPosts"
      is-full
      class="flex justify-center items-center flex-1"
    />
    <template v-else>
      <template v-if="hasPosts">
        <ul class="flex flex-col gap-4 last:pb-4">
          <li v-for="post in posts" :key="post.id">
            <BlogPost :post="post" />
          </li>
        </ul>
        <LazyBaseLoading v-if="isLoading[IsLoadingAction.Get]" is-full class="flex justify-center p-4" />
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
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useInfiniteScroll } from '@vueuse/core';
import { ref, defineAsyncComponent, watch } from 'vue';
import { useRoute } from 'vue-router';
import { isNil } from '@shared/src/utils';
import { toId } from '@shared/src/types';

import DialogPost from './components/DialogPost.vue';
import BlogPost from './components/BlogPost.vue';

import { IsLoadingAction, useBlogStore } from '@/stores/blog';
import { useComponentsStore } from '@/stores/components';
import { useVuelidateBlogPostData } from '@/views/Blog/composables';
import { useAuthStore } from '@/stores/auth';
import { goToPage404 } from '@/composables/goToPage404';

const LazyBaseForm = defineAsyncComponent(() => import('@/components/ui/BaseForm.vue'));
const LazyBaseButton = defineAsyncComponent(() => import('@/components/ui/BaseButton.vue'));
const LazyBaseHr = defineAsyncComponent(() => import('@/components/ui/BaseHr.vue'));
const LazyBaseLoading = defineAsyncComponent(() => import('@/components/ui/BaseLoading.vue'));

const LazyBlogEditPost = defineAsyncComponent(() => import('./components/BlogEditPost.vue'));

const { t } = useI18n({ useScope: 'local' });

const route = useRoute();

const blogStore = useBlogStore();
const { posts, hasPosts, isEnd, isLoading, postSelected } = storeToRefs(blogStore);

const authStore = useAuthStore();
const { isAdmin } = storeToRefs(authStore);

const componentsStore = useComponentsStore();
const { main } = storeToRefs(componentsStore);

useInfiniteScroll(main, () => new Promise((resolve) => blogStore.getPosts().then(() => resolve())), {
  canLoadMore: () => !isEnd.value,
  distance: 100,
});

const getInitialPostData = () => ({
  text: '',
  filesUrls: [],
});

const files = ref<Array<File>>([]);

const postData = ref(getInitialPostData());

const refLazyBlogEditPost = ref<InstanceType<typeof LazyBlogEditPost>>();

const { v$, handle } = useVuelidateBlogPostData(
  () => {
    blogStore.postPost(postData.value, files.value);

    v$.value.$reset();
    files.value = [];

    postData.value = getInitialPostData();

    refLazyBlogEditPost.value?.focusTextarea();
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
      postSelected.value = null;
      return;
    }

    blogStore
      .getPostById(toId(String(route.params.postId)))
      .then((post) => {
        postSelected.value = post;
      })
      .catch(goToPage404);
  },
  {
    immediate: true,
  },
);
</script>

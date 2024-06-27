<template>
  <div class="l-container" :class="$style.blogView">
    <DialogPost />
    <template v-if="isAdmin">
      <LazyBaseForm :class="$style.form" @submit.prevent="onSubmit">
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
      <LazyBaseHr v-if="hasPosts" :class="$style.hr" />
    </template>
    <LazyBaseLoading v-if="isLoading[IsLoadingAction.Get] && !hasPosts" is-full :class="$style.notPosts" />
    <template v-else>
      <template v-if="hasPosts">
        <ul :class="$style.posts">
          <li v-for="post in posts" :key="post.id">
            <BlogPost :post="post" />
          </li>
        </ul>
        <LazyBaseLoading v-if="isLoading[IsLoadingAction.Get]" is-full :class="$style.loadingWithPosts" />
      </template>
      <div v-else class="text-lg" :class="$style.notPosts">
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
import { ref, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { isNotNil } from '@shared/src/utils';
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

if (isNotNil(route.query.postId)) {
  blogStore
    .getPostById(toId(String(route.query.postId)))
    .then((post) => {
      postSelected.value = post;
    })
    .catch(goToPage404);
}
</script>

<style lang="scss" module>
.blogView {
  padding-top: 0.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.notPosts {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.posts {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &:last-child {
    padding-bottom: 1rem;
  }
}

.hr {
  margin: 1rem 0;
}

.loadingWithPosts {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>

<template>
  <div class="l-container" :class="$style.blogView">
    <template v-if="isAdmin">
      <BaseForm :class="$style.form" @submit.prevent="onSubmit">
        <BlogEditPost v-model="postData" v-model:files="files" :v$="v$" @submit="onSubmit" />
        <BaseButton :is-loading="isLoading[IsLoadingAction.Post]" @click="onClickButton">
          {{ t('send') }}
        </BaseButton>
      </BaseForm>
      <BaseHr v-if="hasPosts" :class="$style.hr" />
    </template>
    <BaseLoading v-if="isLoading[IsLoadingAction.Get] && !hasPosts" is-full :class="$style.notPosts" />
    <template v-else>
      <template v-if="hasPosts">
        <ul :class="$style.posts">
          <li v-for="post in posts" :key="post.id">
            <BlogPost :post="post" />
          </li>
        </ul>
        <BaseLoading v-if="isLoading[IsLoadingAction.Get]" is-full :class="$style.loadingWithPosts" />
      </template>
      <div v-else class="text-lg" :class="$style.notPosts">
        {{ t('nothingWasFound') }}
      </div>
    </template>
    <DialogPost />
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
import { ref } from 'vue';

import { BlogEditPost, BlogPost, DialogPost } from './components';

import { IsLoadingAction } from '@/stores/blog';
import { BaseLoading, BaseHr, BaseButton, BaseForm } from '@/components/ui';
import { useComponentsStore, useBlogStore } from '@/stores';
import { useVuelidateBlogPostData } from '@/views/Blog/composables';

const { t } = useI18n({ useScope: 'local' });

const blogStore = useBlogStore();
const { posts, hasPosts, isEnd, isAdmin, isLoading } = storeToRefs(blogStore);

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

const { v$, handle } = useVuelidateBlogPostData(() => {
  blogStore.postPost(postData.value, files.value);

  v$.value.$reset();
  files.value = [];

  postData.value = getInitialPostData();
}, postData);

const onSubmit = handle;
const onClickButton = handle;
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

<template>
  <div class="l-container" :class="$style.blogView">
    <DialogPostVue />
    <BlogForm v-if="isAdmin" />
    <BaseHr v-if="isAdmin && hasPosts" :class="$style.hr" />
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
        {{ t('nothingFound') }}
      </div>
    </template>
  </div>
</template>

<i18n lang="yaml">
En:
  nothingFound: 'Nothing found...'
Ru:
  nothingFound: 'Ничего не найдено...'
</i18n>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useInfiniteScroll } from '@vueuse/core';

import DialogPostVue from '@/views/Blog/components/DialogPost.vue';
import { useBlogStore, IsLoadingAction } from '@/stores/blog';
import BlogForm from '@/views/Blog/components/BlogForm.vue';
import BaseLoading from '@/components/BaseLoading.vue';
import BaseHr from '@/components/BaseHr.vue';
import { useComponentsStore } from '@/stores/components';
import BlogPost from '@/views/Blog/components/BlogPost.vue';

const { t } = useI18n({ useScope: 'local' });

const blogStore = useBlogStore();
const { posts, hasPosts, isEnd, isAdmin, isLoading } = storeToRefs(blogStore);

const componentsStore = useComponentsStore();
const { main } = storeToRefs(componentsStore);

useInfiniteScroll(main, () => new Promise((resolve) => blogStore.getPosts().then(() => resolve())), {
  canLoadMore: () => !isEnd.value,
  distance: 100,
});
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
  margin: 0.75rem 0;
}

.loadingWithPosts {
  display: flex;
  justify-content: center;
  padding: 1rem;
}
</style>

<template>
  <div class="l-container" :class="$style.blogView">
    <BlogForm v-if="isAdmin" />
    <BaseLoading v-if="isLoading[IsLoadingAction.Get]" is-full :class="$style.notPosts" />
    <template v-else>
      <ul v-if="isNotEmptyArray(posts)" :class="$style.posts">
        <li v-for="post in posts" :key="post.id">
          <BlogPost :post="post" />
        </li>
      </ul>
      <div v-else class="f-h2" :class="$style.notPosts">
        {{ t('nothingFound') }}
      </div>
    </template>
  </div>
</template>

<i18n lang="yaml">
en:
  nothingFound: 'Nothing found...'
ru:
  nothingFound: 'Ничего не найдено...'
</i18n>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { isNotEmptyArray } from '@shared/src/utils';
import { useI18n } from 'vue-i18n';

import { useBlogStore, IsLoadingAction } from '@/stores/blog';
import BlogForm from '@/views/Blog/components/BlogForm.vue';
import BlogPost from '@/views/Blog/components/BlogPost.vue';
import BaseLoading from '@/components/BaseLoading.vue';

const { t } = useI18n({ useScope: 'local' });

const blogStore = useBlogStore();
const { posts, isAdmin, isLoading } = storeToRefs(blogStore);

blogStore.getPosts();
</script>

<style lang="scss" module>
.blogView {
  padding-top: 0.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.posts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notPosts {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
</style>

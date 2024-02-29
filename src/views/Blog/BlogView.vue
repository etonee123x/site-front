<template>
  <div class="l-container" :class="$style.blogView">
    <template v-if="isAdmin">
      <BlogForm />
      <BaseHr :class="$style.hr" />
    </template>
    <BaseLoading v-if="isLoading[IsLoadingAction.Get] && !hasPosts" is-full :class="$style.notPosts" />
    <template v-else>
      <ul v-if="hasPosts" :class="$style.posts">
        <li v-for="post in posts" :key="post.id" :class="$style.post">
          <div :class="$style.postInner">
            <BaseHtml :class="$style.postContent" :html="parseContent(post.text)" />
            <span class="text-sm" :class="$style.createdAt" :title="getCreatedAtExact(post)">{{
              getCreatedAtHumanReadable(post)
            }}</span>
          </div>
          <div v-if="isAdmin" :class="$style.controls">
            <BaseButton
              :class="$style.iconDelete"
              :is-loading="isLoading[IsLoadingAction.Delete]"
              @click="() => onClickDelete(post.id)"
            >
              <BaseIcon :path="mdiDelete" />
            </BaseButton>
          </div>
        </li>
      </ul>
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
import { mdiDelete } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import type { Post } from '@shared/src/types';
import { useInfiniteScroll } from '@vueuse/core';

import { useBlogStore, IsLoadingAction } from '@/stores/blog';
import BlogForm from '@/views/Blog/components/BlogForm.vue';
import BaseLoading from '@/components/BaseLoading.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseIcon from '@/components/BaseIcon.vue';
import BaseHr from '@/components/BaseHr.vue';
import { useDateFns } from '@/composables';
import BaseHtml from '@/components/BaseHtml.vue';
import { parseContent } from '@/utils';
import { useComponentsStore } from '@/stores/components';

const { t } = useI18n({ useScope: 'local' });

const blogStore = useBlogStore();
const { posts, hasPosts, isAdmin, isLoading } = storeToRefs(blogStore);

const componentsStore = useComponentsStore();
const { main } = storeToRefs(componentsStore);

useInfiniteScroll(main, () => new Promise((resolve) => blogStore.getPosts().then(() => resolve())));

const { intlFormatDistance } = useDateFns();

const getCreatedAtExact = ({ createdAt }: Post) => String(new Date(createdAt));

const getCreatedAtHumanReadable = ({ createdAt }: Post) => intlFormatDistance.value(createdAt, new Date());

const onClickDelete = blogStore.deletePost;
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

.post {
  margin-bottom: 1rem;
  width: 100%;
  border: 1px solid var(--color-dark);
  border-radius: 0.25rem;
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
}

.controls {
  display: flex;
  justify-content: end;
  border-top: 1px solid var(--color-dark);
  padding: 0.25rem;
  gap: 0.25rem;
}

.hr {
  margin: 0.75rem 0;
}

.postContent {
  white-space: break-spaces;
  word-wrap: break-word;
}
</style>

<template>
  <div class="l-container" :class="$style.blogView">
    <BlogForm v-if="isAdmin" />
    <BaseLoading v-if="isLoading[IsLoadingAction.Get]" is-full :class="$style.notPosts" />
    <template v-else>
      <ul v-if="isNotEmptyArray(posts)" :class="$style.posts">
        <li v-for="post in posts" :key="post.id" :class="$style.post">
          <div :class="$style.postInner">
            <div>{{ post.text }}</div>
            <div class="text-sm" :class="$style.createdAt">
              <span :title="getCreatedAtExact(post)">{{ getCreatedAtHumanReadable(post) }}</span>
            </div>
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
en:
  nothingFound: 'Nothing found...'
ru:
  nothingFound: 'Ничего не найдено...'
</i18n>

<script setup lang="ts">
import { intlFormatDistance } from 'date-fns';
import { mdiDelete } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { isNotEmptyArray } from '@shared/src/utils';
import { useI18n } from 'vue-i18n';
import type { Post } from '@shared/src/types';

import { useBlogStore, IsLoadingAction } from '@/stores/blog';
import BlogForm from '@/views/Blog/components/BlogForm.vue';
import BaseLoading from '@/components/BaseLoading.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseIcon from '@/components/BaseIcon.vue';

const { t } = useI18n({ useScope: 'local' });

const blogStore = useBlogStore();
const { posts, isAdmin, isLoading } = storeToRefs(blogStore);

const getCreatedAtExact = ({ createdAt }: Post) => String(new Date(createdAt));

const getCreatedAtHumanReadable = ({ createdAt }: Post) => intlFormatDistance(createdAt, new Date());

const onClickDelete = blogStore.deletePost;

blogStore.getPosts();
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
  border: var(--border-default);
  border-radius: 0.25rem;
}

.postInner {
  padding: 1rem;
}

.createdAt {
  color: var(--color-dark);
  text-align: end;
}

.controls {
  display: flex;
  justify-content: end;
  border-top: var(--border-default);
  padding: 0.25rem;
  gap: 0.25rem;
}
</style>

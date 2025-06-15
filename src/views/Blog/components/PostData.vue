<template>
  <div class="flex flex-col gap-4">
    <BaseHtml v-if="html" :html />
    <ul v-if="isNotEmptyArray(post.filesUrls)">
      <li v-for="(fileUrl, index) in post.filesUrls" :key="index">
        <PostDataAttachment :fileUrl />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '@etonee123x/shared/types/blog';
import { isNotEmptyArray } from '@etonee123x/shared/utils/isNotEmptyArray';
import { computed } from 'vue';

import PostDataAttachment from './PostDataAttachment.vue';

import BaseHtml from '@/components/ui/BaseHtml.vue';
import { parseContent } from '@/utils/parseContent';

const props = defineProps<{
  post: Post;
}>();

const html = computed(() => parseContent(props.post.text));
</script>

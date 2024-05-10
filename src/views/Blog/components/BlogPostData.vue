<template>
  <div>
    <BaseHtml :html="html" />
    <ul v-if="isNotEmptyArray(post.filesUrls)">
      <li v-for="(fileUrl, index) in post.filesUrls" :key="index">
        <BlogPostAttachment :file-url="fileUrl" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { type Post } from '@shared/src/types';
import { isNotEmptyArray } from '@shared/src/utils';
import { computed } from 'vue';

import BlogPostAttachment from '@/views/Blog/components/BlogPostAttachment.vue';
import BaseHtml from '@/components/BaseHtml.vue';
import { parseContent } from '@/utils';

const props = defineProps<{
  post: Post;
}>();

const html = computed(() => parseContent(props.post.text));
</script>

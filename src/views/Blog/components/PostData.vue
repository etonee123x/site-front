<template>
  <div>
    <BaseHtml :html="html" />
    <ul v-if="isNotEmptyArray(post.filesUrls)">
      <li v-for="(fileUrl, index) in post.filesUrls" :key="index">
        <PostDataAttachment :file-url="fileUrl" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { type Post } from '@shared/src/types';
import { isNotEmptyArray } from '@shared/src/utils';
import { computed } from 'vue';

import PostDataAttachment from './PostDataAttachment.vue';

import { BaseHtml } from '@/components/ui';
import { parseContent } from '@/utils';

const props = defineProps<{
  post: Post;
}>();

const html = computed(() => parseContent(props.post.text));
</script>

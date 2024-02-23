import type { Post } from '@shared/src/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBlogStore = defineStore('blog', () => {
  const posts = ref<Array<Post>>([]);

  return {
    posts,
  };
});

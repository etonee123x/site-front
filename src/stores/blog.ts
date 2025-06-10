import type { Id, Post, PostData } from '@shared/src/types';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useCounter, useToggle } from '@vueuse/core';
import { isNotEmptyArray } from '@shared/src/utils/isNotEmptyArray';

import {
  getPosts as _getPosts,
  postPost as _postPost,
  deletePost as _deletePost,
  putPost as _putPost,
  getPostById as _getPostById,
} from '@/api/posts';
import { postUpload } from '@/api/upload';
import { useAsyncStateApi } from '@/composables/useAsyncStateApi';

export const useBlogStore = defineStore('blog', () => {
  const { inc, reset: _reset, count: page } = useCounter();
  const [isEnd, toggleIsEnd] = useToggle();

  const all = ref<Array<Post>>([]);
  const { execute: getAll, isLoading: isLoadingGetAll } = useAsyncStateApi(
    async (options: { shouldReset?: boolean } = {}) => {
      if (options.shouldReset) {
        all.value = [];
        toggleIsEnd(false);
        _reset();
      }

      return _getPosts(page.value).then(({ data: _posts, meta: { isEnd: _isEnd } }): Array<Post> => {
        all.value = all.value.concat(_posts);
        toggleIsEnd(_isEnd);
        inc();

        return all.value;
      });
    },
    [],
  );

  const { execute: post, isLoading: isLoadingPost } = useAsyncStateApi(
    async (postData: PostData, files: Array<File> = []) => {
      const filesUrls = await postUpload(files);

      return _postPost({ ...postData, filesUrls });
    },
    undefined,
  );

  const { execute: putById, isLoading: isLoadingPutById } = useAsyncStateApi(
    async (id: Id, post: Post, files: Array<File> = []) => {
      const filesUrls = await postUpload(files);

      return _putPost(id, { ...post, filesUrls });
    },
    undefined,
  );

  const { state: byId, execute: getById, isLoading: isLoadingGetById } = useAsyncStateApi(_getPostById, null);

  const { execute: deleteById, isLoading: isLoadingDeleteById } = useAsyncStateApi(_deletePost, null);

  const hasPosts = computed(() => isNotEmptyArray(all.value));

  const editModeFor = ref<Id | null>(null);

  return {
    all,
    getAll,
    isLoadingGetAll,

    post,
    isLoadingPost,

    putById,
    isLoadingPutById,

    byId,
    getById,
    isLoadingGetById,

    deleteById,
    isLoadingDeleteById,

    hasPosts,
    isEnd,
    editModeFor,
  };
});

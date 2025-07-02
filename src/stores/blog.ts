import type { Id } from '@etonee123x/shared/helpers/id';
import type { Post, PostData } from '@etonee123x/shared/types/blog';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useToggle } from '@vueuse/core';

import {
  getPosts as _getPosts,
  postPost as _postPost,
  deletePost as _deletePost,
  putPost as _putPost,
  getPostById as _getPostById,
} from '@/api/posts';
import { postUpload } from '@/api/upload';
import { useAsyncStateApi } from '@/composables/useAsyncStateApi';
import { useResetableRef } from '@/composables/useResetableRef';

export const useBlogStore = defineStore('blog', () => {
  // TODO: сделать SSR-friendly композабл
  // const { inc, reset: resetCounter, count: page } = useCounter();

  const pageNumber = ref(0);
  const [isEnd, toggleIsEnd] = useToggle();

  const [all, resetAll] = useResetableRef<Array<Post>>([]);
  const { execute: getAll, isLoading: isLoadingGetAll } = useAsyncStateApi(
    async (options: { shouldReset?: boolean } = {}) => {
      if (options.shouldReset) {
        resetAll();
        toggleIsEnd(false);
        pageNumber.value = 0;
      }

      return _getPosts(pageNumber.value).then(({ data: _posts, meta: { isEnd: _isEnd } }): Array<Post> => {
        all.value = all.value.concat(_posts);
        toggleIsEnd(_isEnd);
        pageNumber.value++;

        return all.value;
      });
    },
    [],
  );

  const { execute: post, isLoading: isLoadingPost } = useAsyncStateApi(
    async (postData: PostData, files: Array<File> = []) => {
      const filesUrls = files.length ? await postUpload(files) : [];

      return _postPost({ ...postData, filesUrls });
    },
  );

  const { execute: putById, isLoading: isLoadingPutById } = useAsyncStateApi(
    async (id: Id, post: Post, files: Array<File> = []) => {
      const filesUrls = files.length ? await postUpload(files) : [];

      return _putPost(id, { ...post, filesUrls });
    },
  );

  const { state: byId, execute: getById, isLoading: isLoadingGetById } = useAsyncStateApi(_getPostById);

  const { execute: deleteById, isLoading: isLoadingDeleteById } = useAsyncStateApi(_deletePost);

  const hasPosts = computed(() => Boolean(all.value.length));

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

    pageNumber,
  };
});

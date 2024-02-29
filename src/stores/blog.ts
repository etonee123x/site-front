import type { Id, Post, PostData } from '@shared/src/types';
import { defineStore } from 'pinia';
import { ref, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useCounter } from '@vueuse/core';
import { isNotEmptyArray } from '@shared/src/utils';

import { getPosts as _getPosts, postPost as _postPost, deletePost as _deletePost } from '@/api';

export enum IsLoadingAction {
  Get = 'Get',
  Post = 'Post',
  Put = 'Put',
  Delete = 'Delete',
}

export const useBlogStore = defineStore('blog', () => {
  const route = useRoute();

  const posts = ref<Array<Post>>([]);

  const hasPosts = computed(() => isNotEmptyArray(posts.value));

  const isLoading = reactive({
    [IsLoadingAction.Get]: false,
    [IsLoadingAction.Post]: false,
    [IsLoadingAction.Put]: false,
    [IsLoadingAction.Delete]: false,
  });

  const isLoadingAny = computed(() => Object.values(IsLoadingAction).some(Boolean));

  const { inc, reset: _reset, count: page } = useCounter();

  const reset = () => {
    posts.value = [];
    _reset();
  };

  const getPosts = async () => {
    isLoading[IsLoadingAction.Get] = true;

    return _getPosts(page.value)
      .then((_posts) => {
        posts.value = posts.value.concat(_posts);
        inc();

        return posts.value;
      })
      .finally(() => {
        isLoading[IsLoadingAction.Get] = false;
      });
  };

  const postPost = async (postData: PostData) => {
    isLoading[IsLoadingAction.Post] = true;

    return _postPost(postData)
      .then(() => {
        reset();
        getPosts();
      })
      .finally(() => {
        isLoading[IsLoadingAction.Post] = false;
      });
  };

  const deletePost = async (id: Id) => {
    isLoading[IsLoadingAction.Delete] = true;

    return _deletePost(id)
      .then(() => {
        reset();
        getPosts();
      })
      .finally(() => {
        isLoading[IsLoadingAction.Delete] = false;
      });
  };

  const isAdmin = computed(() => route.query['admin'] === 'true');

  return {
    posts,
    hasPosts,
    isAdmin,
    isLoading,
    isLoadingAny,

    getPosts,
    postPost,
    deletePost,
  };
});

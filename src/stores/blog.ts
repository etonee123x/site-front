import type { Id, Post, PostData } from '@shared/src/types';
import { defineStore } from 'pinia';
import { ref, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';

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

  const isLoading = reactive({
    [IsLoadingAction.Get]: false,
    [IsLoadingAction.Post]: false,
    [IsLoadingAction.Put]: false,
    [IsLoadingAction.Delete]: false,
  });

  const isLoadingAny = computed(() => Object.values(IsLoadingAction).some(Boolean));

  const getPosts = async () => {
    isLoading[IsLoadingAction.Get] = true;

    return _getPosts()
      .then((_posts) => {
        posts.value = _posts;

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
        getPosts();
      })
      .finally(() => {
        isLoading[IsLoadingAction.Delete] = false;
      });
  };

  const isAdmin = computed(() => route.query['admin'] === 'true');

  return {
    posts,
    isAdmin,
    isLoading,
    isLoadingAny,

    getPosts,
    postPost,
    deletePost,
  };
});

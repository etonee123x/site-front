import type { Id, Post, PostData } from '@shared/src/types';
import { defineStore } from 'pinia';
import { ref, computed, reactive, shallowRef } from 'vue';
import { useRoute } from 'vue-router';
import { useCounter } from '@vueuse/core';
import { isNotEmptyArray } from '@shared/src/utils';

import {
  getPosts as _getPosts,
  postPost as _postPost,
  deletePost as _deletePost,
  putPost as _putPost,
  getPostById as _getPostById,
} from '@/api';

export enum IsLoadingAction {
  Get = 'Get',
  Post = 'Post',
  Put = 'Put',
  Delete = 'Delete',
}

const createFormDataByPostData = (postData: PostData) => {
  const formData = new FormData();

  formData.append('text', postData.text);

  postData.files.forEach((file) => {
    formData.append('file', file);
  });

  return formData;
};

export const useBlogStore = defineStore('blog', () => {
  const route = useRoute();

  const posts = ref<Array<Post>>([]);

  const postSelected = shallowRef<Post | null>(null);

  const isEnd = ref(false);

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
    isEnd.value = false;
    _reset();
  };

  const editModeFor = ref<Id | null>(null);

  const getPosts = async () => {
    isLoading[IsLoadingAction.Get] = true;

    return _getPosts(page.value)
      .then(({ meta: { isEnd: _isEnd }, data: _posts }) => {
        posts.value = posts.value.concat(_posts);
        isEnd.value = _isEnd;
        inc();

        return posts.value;
      })
      .finally(() => {
        isLoading[IsLoadingAction.Get] = false;
      });
  };

  const postPost = async (postData: PostData) => {
    isLoading[IsLoadingAction.Post] = true;

    return _postPost(createFormDataByPostData(postData))
      .then(() => {
        reset();
        getPosts();
      })
      .finally(() => {
        isLoading[IsLoadingAction.Post] = false;
      });
  };

  const putPost = async (id: Id, postData: PostData) => {
    isLoading[IsLoadingAction.Put] = true;

    return _putPost(id, createFormDataByPostData(postData))
      .then(() => {
        reset();
        getPosts();
      })
      .finally(() => {
        isLoading[IsLoadingAction.Put] = false;
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

  const getPostById = async (id: Id) => {
    isLoading[IsLoadingAction.Get] = true;

    return _getPostById(id)
      .then((_post) => {
        postSelected.value = _post;
      })
      .finally(() => {
        isLoading[IsLoadingAction.Get] = false;
      });
  };

  const isAdmin = computed(() => route.query['admin'] === 'true');

  return {
    posts,
    postSelected,
    hasPosts,
    isAdmin,
    isLoading,
    isLoadingAny,
    isEnd,
    editModeFor,

    getPosts,
    postPost,
    putPost,
    deletePost,
    getPostById,
  };
});

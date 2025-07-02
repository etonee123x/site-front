import { defineStore } from 'pinia';
import { computed } from 'vue';

import { postAuth as _postAuth, deleteAuth as _deleteAuth, Role } from '@/api/auth';
import { useAsyncStateApi } from '@/composables/useAsyncStateApi';

export const useAuthStore = defineStore('auth', () => {
  const { state: authData, execute: postAuth, isLoading: isLoadingPostAuth } = useAsyncStateApi(_postAuth);
  const { execute: deleteAuth, isLoading: isLoadingDeleteAuth } = useAsyncStateApi(_deleteAuth);

  const isAdmin = computed(() => Boolean(authData.value && authData.value.role === Role.Admin));

  return {
    postAuth,
    isLoadingPostAuth,

    deleteAuth,
    isLoadingDeleteAuth,

    isAdmin,
  };
});

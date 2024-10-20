import { defineStore } from 'pinia';
import { computed } from 'vue';

import { getAuthData as _getAuthData, Role } from '@/api/auth';
import { useAsyncStateApi } from '@/composables/useAsyncStateApi';

export const useAuthStore = defineStore('auth', () => {
  const {
    state: authData,
    execute: getAuthData,
    isLoading: isLoadingGetAuthData,
  } = useAsyncStateApi(_getAuthData, null);

  const isAdmin = computed(() => Boolean(authData.value && authData.value.role === Role.Admin));

  return {
    authData,
    getAuthData,
    isLoadingGetAuthData,

    isAdmin,
  };
});

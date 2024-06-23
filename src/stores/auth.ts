import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { getAuthData as _getAuthData } from '@/api';
import { type AuthData, Role } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const authData = ref<AuthData | null>(null);

  const isAdmin = computed(() => Boolean(authData.value && authData.value.role === Role.Admin));

  const getAuthData = () =>
    _getAuthData()
      .then((_authData) => {
        authData.value = _authData;
      })
      .catch(() => {
        authData.value = null;
      });

  return {
    isAdmin,

    getAuthData,
  };
});

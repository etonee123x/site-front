import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed } from 'vue';
import { jwtDecode } from 'jwt-decode';

import { TOKEN } from '@/constants';

enum Role {
  Admin = 'Admin',
}

export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage(
    TOKEN,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQWRtaW4ifQ.Q3WY2NCNnXnpy2jL4285aA2E0UP8bLye1ra06srvNlk',
  );

  const isAdmin = computed(() => {
    if (!token.value) {
      return false;
    }

    try {
      const jwtDecoded = jwtDecode<{ role: Role }>(token.value);

      return jwtDecoded.role === Role.Admin;
    } catch (e) {
      return false;
    }
  });

  return {
    token,
    isAdmin,
  };
});

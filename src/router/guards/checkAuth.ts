import type { NavigationGuard } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import { getCheckAuth } from '@/api';

export const checkAuth: NavigationGuard = async () => {
  const authStore = useAuthStore();
  const { token } = storeToRefs(authStore);

  if (!token) {
    return;
  }

  await getCheckAuth();
};

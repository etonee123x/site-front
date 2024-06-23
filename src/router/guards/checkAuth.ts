import type { NavigationGuard } from 'vue-router';

import { useAuthStore } from '@/stores/auth';
import { TOKEN } from '@/constants';

export const checkAuth: NavigationGuard = async () => {
  if (!localStorage.getItem(TOKEN)) {
    return;
  }

  const authStore = useAuthStore();
  const { getAuthData } = authStore;

  await getAuthData();
};

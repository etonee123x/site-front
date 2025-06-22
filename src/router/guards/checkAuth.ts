import type { NavigationGuard } from 'vue-router';

import { useAuthStore } from '@/stores/auth';
import { TOKEN } from '@/constants';

export const checkAuth: NavigationGuard = async () => {
  if (import.meta.env.SSR) {
    return;
  }

  if (!globalThis.localStorage.getItem(TOKEN)) {
    return;
  }

  const authStore = useAuthStore();

  await authStore.getAuthData();
};

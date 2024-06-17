import type { NavigationGuard } from 'vue-router';

import { TOKEN } from '@/constants';
import { useAuthStore } from '@/stores/auth';

export const setToken: NavigationGuard = async (to) => {
  const maybeToken = to.query[TOKEN];
  if (!maybeToken) {
    return;
  }

  const authStore = useAuthStore();
  const { setAndVerifyToken } = authStore;

  await setAndVerifyToken(String(maybeToken));
};

import type { NavigationGuard } from 'vue-router';
import { omit } from '@shared/src/utils';

import { TOKEN } from '@/constants';

export const setToken: NavigationGuard = async (...[to, , next]) => {
  const maybeToken = to.query[TOKEN];
  if (!maybeToken) {
    return;
  }

  localStorage.setItem(TOKEN, String(maybeToken));

  next({
    ...to,
    query: omit(to.query, [TOKEN]),
  });
};

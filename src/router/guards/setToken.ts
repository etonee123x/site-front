import type { NavigationGuard } from 'vue-router';
import { omit } from '@etonee123x/shared/utils/omit';

import { TOKEN } from '@/constants';

export const setToken: NavigationGuard = async (...[to, , next]) => {
  const maybeToken = to.query[TOKEN];

  if (!maybeToken) {
    return;
  }

  globalThis.localStorage.setItem(TOKEN, String(maybeToken));

  next({
    ...to,
    query: omit(to.query, [TOKEN]),
  });
};

import { createFetch } from 'ofetch';

import { TOKEN } from '@/constants';

const STATUS_UNAUTHORIZED = 401;

export const client = createFetch({
  defaults: {
    baseURL: import.meta.env.VITE_API_URL,
    onRequest({ options }) {
      const maybeToken = localStorage.getItem(TOKEN);

      options.headers = {
        ...options.headers,
        ...(maybeToken
          ? {
              Authorization: maybeToken,
            }
          : {}),
      };
    },
    onResponseError({ response }) {
      if (response.status !== STATUS_UNAUTHORIZED) {
        return;
      }

      localStorage.removeItem(TOKEN);
      window.location.href = '/';
    },
  },
});

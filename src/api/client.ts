import { isTruthy } from '@types';

type Options = Parameters<typeof fetch>[1] & { isRelative?: boolean };

export const get = async <T>(endpoint: string, options?: Options) => {
  const url = [!options?.isRelative && import.meta.env.VITE_API_URL, endpoint].filter(isTruthy).join('');

  return fetch(url, options).then((response) => {
    if (!response.ok) {
      throw new Error();
    }

    return response.json() as T;
  });
};

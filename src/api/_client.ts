import { isServer } from '@/constants/target';
import { createFetch } from 'ofetch';

const baseURL = isServer ? process.env.VITE_API_URL : import.meta.env.VITE_API_URL;

export const client = createFetch({
  defaults: {
    baseURL,
    credentials: 'include',
  },
});

import { client } from '@/api/_client';

export const postAuth = (jwt?: string) =>
  client
    .raw<void>(`/auth`, { method: 'POST', query: { jwt } }) //
    .then((r) => r.headers.getSetCookie());

export const deleteAuth = () => client<void>(`/auth`, { method: 'DELETE' });

import { client } from '@/api/_client';

export const getCheckAuth = () => client<void>(`/check-auth`);

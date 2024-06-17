import { client } from '@/api/_client';
import type { AuthData } from '@/types';

export const getAuthData = () => client<AuthData>(`/auth`);

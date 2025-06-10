import { client } from '@/api/_client';

export enum Role {
  Admin = 'Admin',
}

export interface AuthData {
  role: Role;
}

export const getAuthData = () => client<AuthData>(`/auth`);

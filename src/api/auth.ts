import { client } from '@/api/_client';

export enum Role {
  Admin = 'Admin',
}

export interface AuthData {
  role: Role;
}

export const postAuth = (jwt?: string) => client<AuthData>(`/auth`, { method: 'POST', query: { jwt } });

export const deleteAuth = () => client<void>(`/auth`, { method: 'DELETE' });

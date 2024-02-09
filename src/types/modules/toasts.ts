import type { WithId } from '@/types';

export enum ToastType {
  Error = 'Error',
  Success = 'Success',
}

export type Toast = WithId<{ text: string; type: ToastType }>;

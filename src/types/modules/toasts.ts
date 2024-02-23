import type { WithId } from '@shared/src/types';

export enum ToastType {
  Error = 'Error',
  Success = 'Success',
}

export type Toast = WithId & { text: string; type: ToastType };

import type { WithId } from '@/types';

export enum TOAST_TYPE {
  ERROR = 'error',
  SUCCESS = 'success',
}

export type Toast = WithId<{ text: string; type: TOAST_TYPE }>;

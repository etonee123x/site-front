import type { WithId } from '@/types';

export interface Option<Value = Record<string, unknown> | unknown> extends WithId {
  text: string;
  value: Value;
}

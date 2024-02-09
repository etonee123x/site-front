import type { WithId } from '@/types';

export type Option<Value = Record<string, unknown> | unknown> = WithId<{
  text: string;
  value: Value;
}>;

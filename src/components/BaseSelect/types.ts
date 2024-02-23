import type { WithId } from '@shared/src/types';

export interface Option<Value = Record<string, unknown> | unknown> extends WithId {
  text: string;
  value: Value;
}

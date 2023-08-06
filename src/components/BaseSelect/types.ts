import { VueClass, WithId } from '@/types';

export type Option = WithId<{
  text: string;
  value: Record<string, unknown> | unknown;
  class?: VueClass;
}>

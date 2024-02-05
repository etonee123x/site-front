export * from '@/types/modules';

export type WithId<T> = { id: number } & T;

export type VueClass = string | Record<string, boolean> | Array<string | Record<string, boolean>>;

export type Numberable = number | `${number}`;

export * from '@/types/modules';

export type WithId<T> = { id: number } & T;

export type Numberable = number | `${number}`;

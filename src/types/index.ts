export * from '@/types/modules';

export type Id = (string | number) & { readonly Id: unique symbol };

export interface WithId {
  id: Id;
}

export const toId = (id: Omit<Id, 'Id'>) => id as Id;

export type Numberable = number | `${number}`;

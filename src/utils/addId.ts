import { toId, type WithId } from '@shared/src/types';

export const addId = <T>(el: T, id = Number(crypto.randomUUID().match(/[\d]/g)?.join(''))): WithId & T => ({
  ...el,
  id: toId(id),
});

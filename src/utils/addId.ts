import { toId, type WithId } from '@shared/src/types';

export const addId = <T>(el: T, id: Parameters<typeof toId>[0]): WithId & T => ({
  ...el,
  id: toId(id),
});

import { isServer } from '@/constants/target';

export const clientOnly = (callback: () => unknown) => {
  if (isServer) {
    return;
  }

  callback();
};

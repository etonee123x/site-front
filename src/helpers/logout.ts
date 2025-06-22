import { TOKEN } from '@/constants';

export const logout = () => {
  globalThis.localStorage.removeItem(TOKEN);

  globalThis.location.href = '/';
};

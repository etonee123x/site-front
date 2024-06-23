import { TOKEN } from '@/constants';

export const logout = () => {
  localStorage.removeItem(TOKEN);

  window.location.href = '/';
};

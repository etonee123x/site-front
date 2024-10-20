import type { Settings } from '@/api/config';

declare global {
  interface Window {
    CONFIG: Settings;
  }
}

import { type Settings } from '@/types';

declare global {
  interface Window {
    CONFIG: Settings;
  }
}

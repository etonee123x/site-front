import type { Settings } from '@/constants/settings';

export interface Locals {
  settings?: Settings;
  cookies?: Record<string, string>;
}

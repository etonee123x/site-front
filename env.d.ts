/// <reference types="vite/client" />

import { Settings } from '@/types';
import type { DynamicComponent } from '@/types';

declare module '*.vue' {
  const component: DynamicComponent;
  export default component;
}

declare global {
  interface Window {
    CONFIG: Settings;
  }
}

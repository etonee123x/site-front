/// <reference types="vite/client" />

import type { ComponentPublicInstance } from 'vue';

import { Settings } from '@/types';

declare module '*.vue' {
  const component: ComponentPublicInstance;
  export default component;
}

declare global {
  interface Window {
    CONFIG: Settings;
  }
}

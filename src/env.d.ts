/// <reference types="vite/client" />

import type { DynamicComponent } from '@/types';
declare module '*.vue' {
  const component: DynamicComponent;
  export default component;
}

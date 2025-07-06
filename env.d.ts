/// <reference types="vite/client" />

declare module '*.vue' {
  import type { ComponentPublicInstance } from 'vue';

  const component: ComponentPublicInstance;

  export default component;
}

declare module '*.yaml' {
  type Value = string | number | boolean | null | undefined | Record<string, Value> | Value[];

  type ObjectValue = Record<string, Value>;

  const content: ObjectValue;

  export default content;
}

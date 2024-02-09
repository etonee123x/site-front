declare module '*.vue' {
  import type { ComponentPublicInstance } from 'vue';

  const component: ComponentPublicInstance;
  export default component;
}

declare module '*.yaml' {
  type Obj = Record<string, string>;
  const content: Record<string, string | Obj>;
  export default content;
}

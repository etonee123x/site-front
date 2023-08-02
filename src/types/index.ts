import type { DefineComponent } from 'vue';

export * from '@/types/modules/settings';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type DynamicComponent = DefineComponent<object, object, any>

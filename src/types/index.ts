import type { DefineComponent } from 'vue';

export * from '@/types/modules';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type DynamicComponent = DefineComponent<object, object, any>

export type WithId<T> = { id: number } & T

export type VueClass = string | Record<string, boolean> | Array<string | Record<string, boolean>>

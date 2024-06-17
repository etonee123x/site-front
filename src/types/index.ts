import type { Nil } from '@shared/src/types';

export * from './settings';
export * from './toasts';
export * from './auth';

export type Numberable = number | `${number}`;

export type ReplaceKeys<TObject, Keys extends keyof TObject, NewType> = {
  [_Key in keyof TObject]: _Key extends Keys ? NewType : TObject[_Key];
};

export type PartialKeys<TObject, Keys extends keyof TObject> = {
  [_Key in keyof TObject]: _Key extends Keys ? TObject[_Key] | Nil : TObject[_Key];
};

export type ArrayOrNot<T> = T | Array<T>;

export type Unpromise<T extends Promise<any>> = T extends Promise<infer Result> ? Result : never;

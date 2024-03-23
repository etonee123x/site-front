import type { FunctionCallback } from '@shared/src/types';
import { type ValidationArgs, useVuelidate } from '@vuelidate/core';

export const useVuelidateWithHandle = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends { [key in keyof Vargs]: any },
  Vargs extends ValidationArgs = ValidationArgs,
>(
  callback: FunctionCallback,
  ...parameters: Parameters<typeof useVuelidate<T, Vargs>>
) => {
  const v$ = useVuelidate(...parameters);

  const handle = async () => {
    if (!(await v$.value.$validate())) {
      return;
    }

    return callback();
  };

  return {
    v$,
    handle,
  };
};

import { useLoadingStore } from '@/stores/loading';
import type { FetchError } from 'ofetch';
import { computed, ref, useSSRContext } from 'vue';
import { useResetableRef } from '@/composables/useResetableRef';
import { logout } from '@/helpers/logout';
import { throwError } from '@etonee123x/shared/utils/throwError';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const useAsyncStateApi = <Data, InitialState extends Data | undefined, Params extends Array<any> = []>(
  requestFunction: (...params: Params) => Promise<Data>,
  initialState?: InitialState,
  options: Partial<{
    onSuccess: (data: Data) => void;
  }> = {},
) => {
  const loadingStore = useLoadingStore();

  const state = ref(initialState as InitialState extends undefined ? Data | undefined : Data);

  const [promise, resetPromise] = useResetableRef<Promise<Data> | null>(null);

  const isLoading = computed(() => Boolean(promise.value));

  const _execute = async (...parameters: Params): Promise<Data> => {
    const key = [requestFunction.name, ...parameters].join(':');

    if (import.meta.env.SSR) {
      const ssrContext = useSSRContext() ?? throwError();

      if (!ssrContext.payload[key]) {
        const promise = requestFunction(...parameters)
          .then((data) => {
            ssrContext.payload[key] = data;
            state.value = data;

            options.onSuccess?.(data);

            return state.value;
          })
          .finally(resetPromise);

        return promise;
      }

      state.value = ssrContext.payload[key] as InitialState;

      return state.value;
    }

    const initial = globalThis.__PAYLOAD__?.[key] as InitialState;

    if (initial) {
      state.value = initial;
      delete globalThis.__PAYLOAD__[key];

      return state.value;
    }

    return requestFunction(...parameters).then((data) => {
      state.value = data;

      return state.value;
    });
  };

  const _onError = (error: FetchError<Data>) => {
    // переменную shouldLogout не опускать, она нужна для инкапсуляции
    const shouldLogout = error.status === 401;

    if (shouldLogout) {
      logout();
    }

    throw error;
  };

  const execute = async (...parameters: Params) => {
    const promise = _execute(...parameters)
      .catch(_onError)
      .finally(() => loadingStore.sources.delete(promise));

    loadingStore.sources.add(promise);

    return promise;
  };

  const executeSilently = (...parameters: Params) => _execute(...parameters).catch(_onError);

  return {
    state,
    isLoading,
    promise,
    execute,
    executeSilently,
  };
};

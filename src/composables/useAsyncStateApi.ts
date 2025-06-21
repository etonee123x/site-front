import { useLoadingStore } from '@/stores/loading';
import type { FetchError } from 'ofetch';
import { computed, ref } from 'vue';
import { useResetableRef } from '@/composables/useResetableRef';
import { logout } from '@/helpers/logout';

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

  const _execute = (...parameters: Params) => {
    promise.value = requestFunction(...parameters)
      .then((data) => {
        state.value = data;

        options.onSuccess?.(data);

        return data;
      })
      .finally(resetPromise);

    return promise.value;
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

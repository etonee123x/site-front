import { useLoadingStore } from '@/stores/loading';
import type { FetchError } from 'ofetch';
import { computed, ref } from 'vue';
import { isServer } from '@/constants/target';
import { nonNullable } from '@/utils/nonNullable';
import { useSourcedRef } from '@/composables/useSourcedRef';
import { useSSRContext } from '@/composables/useSSRContext';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type RequestFunction<Data, Params extends Array<any> = []> = (...params: Params) => Promise<Data>;

type Options<Data> = Partial<{
  onSuccess: (data: Data) => void;
}>;

type UseAsyncStateApiParametersWithKey<
  //
  Data,
  InitialState extends Data | undefined,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  Params extends Array<any> = [],
> = [
  //
  key: string,
  requestFunction: RequestFunction<Data, Params>,
  initialState?: InitialState,
  options?: Options<Data>,
];

type UseAsyncStateApiParametersWithoutKey<
  Data,
  InitialState extends Data | undefined,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  Params extends Array<any> = [],
> = [
  //
  requestFunction: RequestFunction<Data, Params>,
  initialState?: InitialState,
  options?: Options<Data>,
];

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type UseAsyncStateApiParameters<Data, InitialState extends Data | undefined, Params extends Array<any> = []> =
  | UseAsyncStateApiParametersWithKey<Data, InitialState, Params>
  | UseAsyncStateApiParametersWithoutKey<Data, InitialState, Params>;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const useAsyncStateApi = <Data, InitialState extends Data | undefined, Params extends Array<any> = []>(
  ...parameters: UseAsyncStateApiParameters<Data, InitialState, Params>
) => {
  const [
    //
    key,
    requestFunction,
    initialState,
    options = {},
  ] = parameters as UseAsyncStateApiParametersWithKey<Data, InitialState, Params>;

  const loadingStore = useLoadingStore();

  const state = ref(initialState as InitialState extends undefined ? Data | undefined : Data);

  const [promise, resetPromise] = useSourcedRef<Promise<Data> | null>(null);

  const isLoading = computed(() => Boolean(promise.value));

  const _execute = async (...parameters: Params): Promise<Data> => {
    if (isServer) {
      const ssrContext = nonNullable(useSSRContext());

      if (!ssrContext.payload[key]) {
        promise.value = requestFunction(...parameters)
          .then((data) => {
            ssrContext.payload[key] = data;
            state.value = data;

            options.onSuccess?.(data);

            return state.value;
          })
          .finally(resetPromise);

        return promise.value;
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

    promise.value = requestFunction(...parameters)
      .then((data) => {
        state.value = data;

        return state.value;
      })
      .finally(resetPromise);

    return promise.value;
  };

  const _onError = (error: FetchError<Data>) => {
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

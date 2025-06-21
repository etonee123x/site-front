import { clone } from '@/utils/clone';
import { ref, toValue, type MaybeRefOrGetter } from 'vue';

export const useResetableRef = <InitialState>(initialState: MaybeRefOrGetter<InitialState>) => {
  const getClonedInitialStateValue = () => clone(toValue(initialState));

  const value = ref(getClonedInitialStateValue());

  const reset = () => {
    value.value = getClonedInitialStateValue();
  };

  return [value, reset] as const;
};

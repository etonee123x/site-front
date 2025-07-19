import { clone } from '@/utils/clone';
import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue';

export const useSourcedRef = <Source>(
  source: MaybeRefOrGetter<Source>,
  options: Partial<{
    isAutoSynced: boolean;
  }> = {},
) => {
  const { isAutoSynced = false } = options;

  const sourceComputed = computed(() => toValue(source));

  const getClonedSourceValue = () => clone(sourceComputed.value);

  const value = ref(getClonedSourceValue());

  const sync = () => {
    value.value = getClonedSourceValue();
  };

  if (isAutoSynced) {
    watch(sourceComputed, sync, { deep: true });
  }

  return [value, sync] as const;
};

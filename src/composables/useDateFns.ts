import { intlFormatDistance as _intlFormatDistance } from 'date-fns';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { useSettingsStore } from '@/stores/settings';

export const useDateFns = () => {
  const settingsStore = useSettingsStore();
  const { dateFnsLocale } = storeToRefs(settingsStore);

  const intlFormatDistance = computed<typeof _intlFormatDistance>(
    () => (date, baseDate, options) =>
      _intlFormatDistance(date, baseDate, { ...options, locale: dateFnsLocale.value.code }),
  );

  return {
    intlFormatDistance,
  };
};

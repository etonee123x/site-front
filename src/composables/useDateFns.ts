import { intlFormatDistance as _intlFormatDistance, format as _format } from 'date-fns';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { useSettingsStore } from '@/stores';

export const useDateFns = () => {
  const settingsStore = useSettingsStore();
  const { dateFnsLocale } = storeToRefs(settingsStore);

  const intlFormatDistance = computed<typeof _intlFormatDistance>(
    () => (date, baseDate, options) =>
      _intlFormatDistance(date, baseDate, { locale: dateFnsLocale.value.code, ...options }),
  );

  const format = computed<typeof _format>(
    () => (date, formatStr, options) => _format(date, formatStr, { locale: dateFnsLocale.value, ...options }),
  );

  return {
    intlFormatDistance,
    format,
  };
};

import { intlFormatDistance as _intlFormatDistance, format as _format } from 'date-fns';
import { computed } from 'vue';

import { useSettingsStore } from '@/stores/settings';

export const useDateFns = () => {
  const settingsStore = useSettingsStore();

  const intlFormatDistance = computed<typeof _intlFormatDistance>(
    () => (date, baseDate, options) =>
      _intlFormatDistance(date, baseDate, { locale: settingsStore.dateFnsLocale.code, ...options }),
  );

  const format = computed<typeof _format>(
    () => (date, formatStr, options) => _format(date, formatStr, { locale: settingsStore.dateFnsLocale, ...options }),
  );

  return {
    intlFormatDistance,
    format,
  };
};

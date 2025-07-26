import { format as _format, intlFormatDistance as _intlFormatDistance } from 'date-fns';

import { useSettingsStore } from '@/stores/settings';

import type { DateArg, IntlFormatDistanceOptions } from 'date-fns';

export const useDateFns = () => {
  const settingsStore = useSettingsStore();

  const intlFormatDistance: typeof _intlFormatDistance = (date, baseDate, options) =>
    _intlFormatDistance(date, baseDate, { locale: settingsStore.dateFnsLocale.code, ...options });

  const intlFormatDistanceToNow = (timeSince: DateArg<Date>, options?: IntlFormatDistanceOptions) =>
    _intlFormatDistance(0, timeSince, { locale: settingsStore.dateFnsLocale.code, ...options });

  const format: typeof _format = (date, formatStr, options) =>
    _format(date, formatStr, { locale: settingsStore.dateFnsLocale, ...options });

  return {
    format,
    intlFormatDistance,
    intlFormatDistanceToNow,
  };
};

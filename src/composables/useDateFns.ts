import { format as _format } from 'date-fns';

import { useSettingsStore } from '@/stores/settings';

export const useDateFns = () => {
  const settingsStore = useSettingsStore();

  const format: typeof _format = (date, formatStr, options) =>
    _format(date, formatStr, { locale: settingsStore.dateFnsLocale, ...options });

  return {
    format,
  };
};

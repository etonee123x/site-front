import { useSettingsStore } from '@/stores/settings';
import { computed, toValue, type MaybeRefOrGetter } from 'vue';

export const useIntlRelativeTimeFormat = (
  _locales?: MaybeRefOrGetter<Intl.LocalesArgument>,
  options?: MaybeRefOrGetter<Intl.RelativeTimeFormatOptions>,
) => {
  const settingsStore = useSettingsStore();

  return computed(
    () => new Intl.RelativeTimeFormat(toValue(_locales) ?? settingsStore.languageInfo?.locale, toValue(options)),
  );
};

import { createI18n } from 'vue-i18n';

import en from '@/i18n/languages/en.yaml';
import ru from '@/i18n/languages/ru.yaml';

export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    ru,
  },
});

export const setLocale = (locale: (typeof i18n)['global']['locale']) => {
  // @ts-ignore
  i18n.global.locale.value = locale;
};

import { createI18n } from 'vue-i18n';

import en from '@/i18n/languages/en.json';
import ru from '@/i18n/languages/ru.json';

export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
  messages: {
    en,
    ru,
  },
});

import { createI18n } from 'vue-i18n';

import En from '@/i18n/languages/En.json';
import Ru from '@/i18n/languages/Ru.json';

export const i18n = createI18n({
  locale: 'En',
  fallbackLocale: 'En',
  legacy: false,
  messages: {
    En,
    Ru,
  },
});

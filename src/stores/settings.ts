import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { enGB, ru } from 'date-fns/locale';

import { i18n } from '@/i18n';
import { Language, ThemeColor, type Settings } from '@/constants/settings';
import { useCookies } from '@vueuse/integrations/useCookies';
import { throwError } from '@etonee123x/shared/utils/throwError';
import { themeColorToThemeColorClass } from '@/helpers/themeColor';
import { THEME_COLOR } from '@/helpers/ui';

const LANGUAGE_TO_DATE_FNS_LOCALE = Object.freeze({
  [Language.En]: enGB,
  [Language.Ru]: ru,
});

export const useSettingsStore = defineStore('settings', () => {
  const cookies = useCookies();
  const { t } = i18n.global;

  const themeColorToThemeColorTranslation = computed(() =>
    Object.freeze({
      [ThemeColor.Blue]: t('themeColor.blue'),
      [ThemeColor.Cyan]: t('themeColor.cyan'),
      [ThemeColor.Green]: t('themeColor.green'),
      [ThemeColor.Magenta]: t('themeColor.magenta'),
      [ThemeColor.Orange]: t('themeColor.orange'),
      [ThemeColor.Random]: t('themeColor.random'),
      [ThemeColor.Red]: t('themeColor.red'),
    }),
  );

  const settings = ref<Settings>({
    themeColor: cookies.get('themeColor'),
    language: cookies.get('language'),
  });

  const themeColor = computed(() => settings.value.themeColor);

  const initSettings = (settings: Settings) => {
    setColor(settings.themeColor);
    setLanguage(settings.language);
  };

  const setLanguage = (language: Language) => {
    settings.value.language = language;
    i18n.global.locale.value = settings.value.language;
  };

  const setColor = (themeColor: ThemeColor) => {
    settings.value.themeColor = themeColor;

    if (import.meta.env.SSR) {
      return;
    }

    let color = themeColor;

    if (themeColor === ThemeColor.Random) {
      const colorsWithoutRandom = Object.values(ThemeColor).filter((themeColor) => themeColor !== ThemeColor.Random);

      color = colorsWithoutRandom[Math.floor(Math.random() * colorsWithoutRandom.length)] ?? throwError();
    }

    const bodyClassList = document.querySelector('body')?.classList;

    bodyClassList?.remove(...Object.values(THEME_COLOR));
    bodyClassList?.add(themeColorToThemeColorClass(color));
  };

  const dateFnsLocale = computed(() => LANGUAGE_TO_DATE_FNS_LOCALE[i18n.global.locale.value]);

  const saveSettings = (_settings: Settings) => {
    // сохранить настройки

    initSettings(_settings);
  };

  const resetSettings = () => {
    // вернуть настройки из кук
  };

  watch(
    settings,
    () => {
      cookies.set('language', settings.value.language);
      cookies.set('themeColor', settings.value.themeColor);
    },
    { deep: true },
  );

  return {
    settings,
    themeColor,
    dateFnsLocale,

    themeColorToThemeColorTranslation,

    initSettings,
    saveSettings,
    resetSettings,
    setColor,
  };
});

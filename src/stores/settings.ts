import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

import { i18n } from '@/i18n';
import { Language, ThemeColor, type Settings } from '@/constants/settings';
import { useCookies } from '@vueuse/integrations/useCookies';
import { themeColorToThemeColorClass } from '@/helpers/themeColor';
import { THEME_COLOR } from '@/helpers/ui';
import { isServer } from '@/constants/target';
import { nonNullable } from '@/utils/nonNullable';

const LANGUAGES = [
  {
    name: Language.En,
    locale: 'en-GB',
  },
  {
    name: Language.Ru,
    locale: 'ru-RU',
  },
] as const;

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

    if (isServer) {
      return;
    }

    let color = themeColor;

    if (themeColor === ThemeColor.Random) {
      const colorsWithoutRandom = Object.values(ThemeColor).filter((themeColor) => themeColor !== ThemeColor.Random);

      color = nonNullable(colorsWithoutRandom[Math.floor(Math.random() * colorsWithoutRandom.length)]);
    }

    const bodyClassList = document.querySelector('body')?.classList;

    bodyClassList?.remove(...Object.values(THEME_COLOR));
    bodyClassList?.add(themeColorToThemeColorClass(color));
  };

  const languageInfo = computed(() => LANGUAGES.find((language) => language.name === settings.value.language));

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

    languageInfo,

    themeColorToThemeColorTranslation,

    initSettings,
    saveSettings,
    resetSettings,
    setColor,
  };
});

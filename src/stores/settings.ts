import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { enGB, ru } from 'date-fns/locale';

import { i18n } from '@/i18n';
import { type Settings, ThemeColor, Language } from '@/types';

const CLASS_TITLES = Object.freeze({
  THEME_COLOR: 'theme_color',
  THEME_MODE: 'theme_mode',
});

const LOCAL_STORAGE_SETTINGS_FIELD_TITLE = 'SETTINGS';

const getLocalStorageSettings = () => {
  let result: Partial<Settings> = {};

  const localStorageSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_FIELD_TITLE);

  if (localStorageSettings) {
    try {
      result = JSON.parse(localStorageSettings);
    } catch (e) {
      console.error(e);
    }
  }

  return result;
};

const LANGUAGE_TO_DATE_FNS_LOCALE = Object.freeze({
  [Language.En]: enGB,
  [Language.Ru]: ru,
});

export const useSettingsStore = defineStore('settings', () => {
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

  const _settings = ref(Object.assign({}, window.CONFIG, getLocalStorageSettings()));

  const settings = computed({
    get: () => _settings.value,
    set: (v) => {
      _settings.value = v;

      initSettings();
    },
  });

  const themeColor = computed(() => _settings.value.themeColor);
  const language = computed(() => _settings.value.language);

  const initSettings = () => {
    setColor(themeColor.value);
    setLanguage(language.value);
  };

  const setColor = (color: ThemeColor) => {
    type ThemeColorWithoutRandom = Exclude<ThemeColor, ThemeColor.Random>;

    let _color: ThemeColorWithoutRandom | null = null;
    if (color === ThemeColor.Random) {
      const colorsWithoutRandom = Object.values(ThemeColor).filter(
        (c): c is ThemeColorWithoutRandom => c !== ThemeColor.Random,
      );

      _color = colorsWithoutRandom[Math.floor(Math.random() * colorsWithoutRandom.length)];
    }

    const bodyClassList = document.querySelector('body')?.classList;
    const oldClasses = Array.from(bodyClassList ?? []);
    const newClasses = oldClasses.filter((_class) => !_class.startsWith(CLASS_TITLES.THEME_COLOR));

    newClasses.push([CLASS_TITLES.THEME_COLOR, (_color ?? color).toLowerCase()].join('_'));

    bodyClassList?.remove(...oldClasses);
    bodyClassList?.add(...newClasses);

    _settings.value.themeColor = color;
  };

  const setLanguage = (language: Language) => {
    i18n.global.locale.value = language;
  };

  const dateFnsLocale = computed(() => LANGUAGE_TO_DATE_FNS_LOCALE[i18n.global.locale.value]);

  const saveSettings = () => localStorage.setItem(LOCAL_STORAGE_SETTINGS_FIELD_TITLE, JSON.stringify(settings.value));

  const resetSettings = () => {
    localStorage.removeItem(LOCAL_STORAGE_SETTINGS_FIELD_TITLE);

    settings.value = Object.assign({}, window.CONFIG);
  };

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

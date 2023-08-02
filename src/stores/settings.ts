import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { Settings, THEME_COLOR, THEME_MODE } from '@/types';

enum CLASS_TITLE {
  THEME = 'theme',
  THEME_COLOR = 'theme_color',
  THEME_MODE = 'theme_mode',
}

const LOCAL_STORAGE_SETTINGS_FIELD_TITLE = 'SETTINGS';

const getLocalStorageSettings = () => {
  let result: Partial<Settings> = {};

  if (localStorage.getItem(LOCAL_STORAGE_SETTINGS_FIELD_TITLE)) {
    try {
      result = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_FIELD_TITLE) ?? '');
    } catch (e) {
      console.error(e);
    }
  }

  return result;
};

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings>(Object.assign(
    window.CONFIG,
    getLocalStorageSettings(),
  ));

  const color = computed(() => settings.value?.themeColor ?? null);
  const mode = computed(() => settings.value?.themeMode ?? null);

  const initSettings = () => {
    if (color.value) {
      setColor(color.value);
    }

    if (mode.value) {
      setMode(mode.value);
    }
  };

  const setColor = (color: THEME_COLOR) => {
    type ThemeColorWithoutRandom = Exclude<THEME_COLOR, THEME_COLOR.RANDOM>

    const bodyClassList = document.querySelector('body')?.classList;

    const oldClasses = Array.from(bodyClassList ?? []);

    const newClasses = oldClasses.filter(_class => !_class.startsWith(CLASS_TITLE.THEME_COLOR));

    let _color: ThemeColorWithoutRandom | null = null;
    if (color === THEME_COLOR.RANDOM) {
      const colorsWithoutRandom = Object
        .values(THEME_COLOR)
        .filter((c): c is ThemeColorWithoutRandom => c !== THEME_COLOR.RANDOM);

      _color = colorsWithoutRandom[Math.floor(Math.random() * colorsWithoutRandom.length)];
    }

    newClasses.push([CLASS_TITLE.THEME_COLOR, _color ?? color].join('_'));

    bodyClassList?.remove(...oldClasses);
    bodyClassList?.add(...newClasses);

    settings.value.themeColor = color;
  };

  const setMode = (mode: THEME_MODE) => {
    settings.value.themeMode = mode;
  };

  const saveSettings = () => localStorage.setItem(LOCAL_STORAGE_SETTINGS_FIELD_TITLE, JSON.stringify(settings.value));

  const resetSettings = () => {
    localStorage.removeItem(LOCAL_STORAGE_SETTINGS_FIELD_TITLE);
    settings.value = window.CONFIG;
    initSettings();
  };

  return {
    settings,
    color,
    mode,

    initSettings,
    saveSettings,
    resetSettings,
    setColor,
    setMode,
  };
});

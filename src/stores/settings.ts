import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { usePreferredDark } from '@vueuse/core';

import { Settings, THEME_COLOR, THEME_MODE } from '@/types';

const CLASS_TITLES = Object.freeze({
  THEME: 'theme',
  THEME_COLOR: 'theme_color',
  THEME_MODE: 'theme_mode',
});

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
  const _settings = ref<Settings>(Object.assign({}, window.CONFIG, getLocalStorageSettings()));

  const isPreferredDark = usePreferredDark();

  const settings = computed({
    get: () => _settings.value,
    set: (v) => {
      _settings.value = v;

      initSettings();
    },
  });

  const themeColor = computed(() => _settings.value.themeColor);
  const themeMode = computed(() => _settings.value.themeMode);

  const initSettings = () => {
    setColor(themeColor.value);
    setMode(themeMode.value);
  };

  const setColor = (color: THEME_COLOR) => {
    type ThemeColorWithoutRandom = Exclude<THEME_COLOR, THEME_COLOR.RANDOM>;

    let _color: ThemeColorWithoutRandom | null = null;
    if (color === THEME_COLOR.RANDOM) {
      const colorsWithoutRandom = Object.values(THEME_COLOR).filter(
        (c): c is ThemeColorWithoutRandom => c !== THEME_COLOR.RANDOM,
      );

      _color = colorsWithoutRandom[Math.floor(Math.random() * colorsWithoutRandom.length)];
    }

    const bodyClassList = document.querySelector('body')?.classList;
    const oldClasses = Array.from(bodyClassList ?? []);
    const newClasses = oldClasses.filter((_class) => !_class.startsWith(CLASS_TITLES.THEME_COLOR));

    newClasses.push([CLASS_TITLES.THEME_COLOR, _color ?? color].join('_'));

    bodyClassList?.remove(...oldClasses);
    bodyClassList?.add(...newClasses);

    _settings.value.themeColor = color;
  };

  const themeModeSystem = computed(() => (isPreferredDark.value ? THEME_MODE.DARK : THEME_MODE.LIGHT));

  const setMode = (mode: THEME_MODE, asSystem = false) => {
    const _mode = mode === THEME_MODE.SYSTEM || asSystem ? themeModeSystem.value : mode;
    const bodyClassList = document.querySelector('body')?.classList;
    const oldClasses = Array.from(bodyClassList ?? []);
    const newClasses = oldClasses.filter((_class) => !_class.startsWith(CLASS_TITLES.THEME_MODE));

    newClasses.push([CLASS_TITLES.THEME_MODE, _mode].join('_'));

    bodyClassList?.remove(...oldClasses);
    bodyClassList?.add(...newClasses);

    _settings.value.themeMode = asSystem ? THEME_MODE.SYSTEM : mode;
  };

  const setSettings = (_settings: Settings) => {
    settings.value = Object.assign(settings.value, _settings);
  };

  const saveSettings = () => localStorage.setItem(LOCAL_STORAGE_SETTINGS_FIELD_TITLE, JSON.stringify(settings.value));

  const resetSettings = () => {
    localStorage.removeItem(LOCAL_STORAGE_SETTINGS_FIELD_TITLE);

    settings.value = Object.assign({}, window.CONFIG);
  };

  watch(
    themeModeSystem,
    (v) => {
      if (_settings.value.themeMode !== THEME_MODE.SYSTEM) {
        return;
      }

      setMode(v, true);
    },
    { immediate: true },
  );

  return {
    settings,
    themeColor,
    themeMode,

    setSettings,
    initSettings,
    saveSettings,
    resetSettings,
    setColor,
    setMode,
  };
});

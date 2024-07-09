<template>
  <BaseDialog
    v-model="isOpened"
    :title="t('settings')"
    width="20rem"
    height="20rem"
    @close="onDialogClose"
    @confirm="onDialogConfirm"
  >
    <div :class="$style.content">
      <div :class="$style.row">
        <span>{{ t('color') }}</span>
        <BaseSelect
          v-model="model.themeColor"
          :class="$style.select"
          :options="
            Object.values(ThemeColor).map((color) => ({
              label: themeColorToThemeColorTranslation[color],
              value: color,
            }))
          "
          :reduce="propFn('value')"
        />
      </div>
      <div :class="$style.row">
        <span>{{ t('mode') }}</span>
        <BaseSelect
          v-model="model.themeMode"
          :class="$style.select"
          :options="
            Object.values(ThemeMode).map((mode) => ({
              label: themeModeToThemeModeTranslation[mode],
              value: mode,
            }))
          "
          :reduce="propFn('value')"
        />
      </div>
      <div :class="$style.row">
        <span>{{ t('language') }}</span>
        <BaseSelect
          v-model="model.language"
          :class="$style.select"
          :options="Object.values(Language).map((language) => ({ label: language.toUpperCase(), value: language }))"
          :reduce="propFn('value')"
        />
      </div>
      <BaseButton @click="onClickResetSettings">{{ t('resetSettings') }}</BaseButton>
    </div>
  </BaseDialog>
</template>

<i18n lang="yaml">
En:
  settings: 'Settings'
  color: 'Color:'
  mode: 'Mode:'
  language: 'Language:'
  resetSettings: 'Reset settings'
Ru:
  settings: 'Настройки'
  color: 'Цвет:'
  mode: 'Режим:'
  language: 'Язык:'
  resetSettings: 'Сбросить настройки'
</i18n>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useToggle } from '@vueuse/core';
import { propFn } from '@shared/src/utils';

import { useSettingsStore } from '@/stores/settings';
import BaseDialog from '@/components/ui/BaseDialog.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import { Language, ThemeColor, ThemeMode } from '@/types';

const isOpened = defineModel<boolean>();

const toggle = useToggle(isOpened);

const settingsStore = useSettingsStore();
const { settings, themeColorToThemeColorTranslation, themeModeToThemeModeTranslation } = storeToRefs(settingsStore);

const { t } = useI18n({ useScope: 'local' });

const model = ref(settings.value);

const onDialogClose = () => toggle(false);

const onDialogConfirm = () => {
  settings.value = model.value;

  settingsStore.saveSettings();

  onDialogClose();
};

const onClickResetSettings = () => {
  settingsStore.resetSettings();

  model.value = settings.value;
};
</script>

<style lang="scss" module>
.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select {
  width: 8rem;
}
</style>

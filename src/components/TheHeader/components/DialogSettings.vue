<template>
  <BaseDialog
    v-model="isOpened"
    :title="title"
    width="20rem"
    height="20rem"
    @close="onDialogClose"
    @confirm="onDialogConfirm"
  >
    <div :class="$style.content">
      <div v-for="option in options" :key="option.id" :class="$style.row">
        <span>{{ option.text }}</span>
        <BaseSelect
          :model-value="option.modelValue"
          :class="$style.select"
          :options="option.options"
          @update:model-value="option.onUpdate"
        />
      </div>
      <BaseButton @click="onClickResetSettings">{{ resetSettings }}</BaseButton>
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
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useToggle } from '@vueuse/core';

import { useSettingsStore } from '@/stores/settings';
import { addId } from '@/utils';
import BaseDialog from '@/components/ui/BaseDialog.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseSelect, { type Option } from '@/components/BaseSelect';
import { Language, ThemeColor, ThemeMode } from '@/types';

const isOpened = defineModel<boolean>();

const toggle = useToggle(isOpened);

const settingsStore = useSettingsStore();
const { settings, themeColorToThemeColorTranslation, themeModeToThemeModeTranslation } = storeToRefs(settingsStore);

const { t } = useI18n({ useScope: 'local' });

const model = ref(settings.value);

const options = computed(() =>
  [
    {
      text: t('color'),
      options: Object.values(ThemeColor).map((color) =>
        addId({ text: themeColorToThemeColorTranslation.value[color], value: color }),
      ),
      modelValue: {
        text: themeColorToThemeColorTranslation.value[model.value.themeColor],
        value: model.value.themeColor,
      },
      onUpdate: (option: Option<ThemeColor>) => {
        model.value.themeColor = option.value;
      },
    },
    {
      text: t('mode'),
      options: Object.values(ThemeMode).map((mode) =>
        addId({ text: themeModeToThemeModeTranslation.value[mode], value: mode }),
      ),
      modelValue: {
        text: themeModeToThemeModeTranslation.value[model.value.themeMode],
        value: model.value.themeMode,
      },
      onUpdate: (option: Option<ThemeMode>) => {
        model.value.themeMode = option.value;
      },
    },
    {
      text: t('language'),
      options: Object.values(Language).map((language) => addId({ text: language.toUpperCase(), value: language })),
      modelValue: {
        text: model.value.language.toUpperCase(),
        value: model.value.language,
      },
      onUpdate: (option: Option<Language>) => {
        model.value.language = option.value;
      },
    },
  ].map(addId),
);

const title = computed(() => t('settings'));
const resetSettings = computed(() => t('resetSettings'));

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

<template>
  <BaseDialog ref="refBaseDialog" :title="t('settings')" style="max-width: 25rem" @confirm="onConfirm" @close="onClose">
    <div class="flex flex-col gap-4 mb-6">
      <div class="flex justify-between items-center">
        <span>{{ t('color') }}</span>
        <BaseSelect
          v-model="model.themeColor"
          class="w-32"
          :options="
            Object.values(ThemeColor).map((color) => ({
              label: themeColorToThemeColorTranslation[color],
              value: color,
            }))
          "
          :reduce="propFn('value')"
        />
      </div>
      <div class="flex justify-between items-center">
        <span>{{ t('language') }}</span>
        <BaseSelect
          v-model="model.language"
          class="w-32"
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
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { propFn } from '@shared/src/utils';

import { useSettingsStore } from '@/stores/settings';
import BaseDialog from '@/components/ui/BaseDialog.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import { Language, ThemeColor } from '@/types';
import { clone } from '@/utils/clone';

const refBaseDialog = ref<InstanceType<typeof BaseDialog>>();

const settingsStore = useSettingsStore();
const { settings, themeColorToThemeColorTranslation } = storeToRefs(settingsStore);

const { t } = useI18n({ useScope: 'local' });

const model = ref(clone(settings.value));

const onConfirm = () => {
  settings.value = model.value;

  settingsStore.saveSettings();
};

const resetModel = () => {
  model.value = clone(settings.value);
};

const onClose = () => {
  resetModel();
};

const onClickResetSettings = () => {
  settingsStore.resetSettings();

  resetModel();
};

defineExpose({
  open: () => refBaseDialog.value?.open(),
  close: () => refBaseDialog.value?.close(),
  isOpened: computed(() => refBaseDialog.value?.isOpened),
});
</script>

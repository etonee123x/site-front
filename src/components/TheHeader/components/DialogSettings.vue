<template>
  <BaseDialog :title="t('settings')" style="max-width: 25rem" ref="refBaseDialog" @confirm="onConfirm" @close="onClose">
    <div class="flex flex-col gap-4 mb-6">
      <div class="flex justify-between items-center">
        <span>{{ t('color') }}</span>
        <BaseSelect
          class="w-32"
          :options="
            Object.values(ThemeColor).map((color) => ({
              label: settingsStore.themeColorToThemeColorTranslation[color],
              value: color,
            }))
          "
          :reduce="propFn('value')"
          v-model="model.themeColor"
        />
      </div>
      <div class="flex justify-between items-center">
        <span>{{ t('language') }}</span>
        <BaseSelect
          class="w-32"
          :options="Object.values(Language).map((language) => ({ label: language.toUpperCase(), value: language }))"
          :reduce="propFn('value')"
          v-model="model.language"
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
import { useI18n } from 'vue-i18n';
import { propFn } from '@shared/src/utils';

import { useSettingsStore } from '@/stores/settings';
import BaseDialog from '@/components/ui/BaseDialog.vue';
import BaseButton from '@/components/ui/BaseButton';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import { clone } from '@/utils/clone';
import { Language, ThemeColor } from '@/api/config';

const refBaseDialog = ref<InstanceType<typeof BaseDialog>>();

const settingsStore = useSettingsStore();

const { t } = useI18n({ useScope: 'local' });

const model = ref(clone(settingsStore.settings));

const onConfirm = () => {
  settingsStore.settings = model.value;

  settingsStore.saveSettings();
};

const resetModel = () => {
  model.value = clone(settingsStore.settings);
};

const onClose = resetModel;

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

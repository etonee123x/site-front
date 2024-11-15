<template>
  <BaseDialog :title="t('settings')" style="max-width: 25rem" ref="baseDialog" @confirm="onConfirm" @close="onClose">
    <div class="flex flex-col gap-4 mb-6">
      <BaseSelect :options="Object.values(ThemeColor)" :label="t('color')" v-model="model.themeColor" />
      <BaseSelect :options="Object.values(Language)" :label="t('language')" v-model="model.language" />
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
import { ref, computed, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

import { useSettingsStore } from '@/stores/settings';
import BaseDialog from '@/components/ui/BaseDialog.vue';
import BaseButton from '@/components/ui/BaseButton';
import BaseSelect from '@/components/ui/BaseSelect';
import { clone } from '@/utils/clone';
import { Language, ThemeColor } from '@/api/config';

const baseDialog = useTemplateRef('baseDialog');

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
  open: () => baseDialog.value?.open(),
  close: () => baseDialog.value?.close(),
  isOpened: computed(() => baseDialog.value?.isOpened),
});
</script>

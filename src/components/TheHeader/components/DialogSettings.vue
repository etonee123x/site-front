<template>
  <BaseDialog :title="t('settings')" style="max-width: 25rem" ref="baseDialog" @confirm="onConfirm" @close="onClose">
    <BaseForm class="flex flex-col gap-4 mb-6">
      <BaseSelect :options="Object.values(ThemeColor)" :label="t('color')" v-model="model.themeColor" />
      <BaseSelect :options="Object.values(Language)" :label="t('language')" v-model="model.language" />
      <BaseButton v-if="isDevelopment && !authStore.isAdmin" @click="onClickAuthorize">{{ t('authorize') }}</BaseButton>
    </BaseForm>
  </BaseDialog>
</template>

<i18n lang="yaml">
En:
  settings: 'Settings'
  color: 'Color:'
  mode: 'Mode:'
  language: 'Language:'
  resetSettings: 'Reset settings'
  authorize: 'Authorize'
Ru:
  settings: 'Настройки'
  color: 'Цвет:'
  mode: 'Режим:'
  language: 'Язык:'
  resetSettings: 'Сбросить настройки'
  authorize: 'Авторизоваться'
</i18n>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

import { useSettingsStore } from '@/stores/settings';
import BaseDialog from '@/components/ui/BaseDialog.vue';
import BaseButton from '@/components/ui/BaseButton';
import BaseSelect from '@/components/ui/BaseSelect';
import { Language, ThemeColor } from '@/constants/settings';
import { useAuthStore } from '@/stores/auth';
import { isDevelopment } from '@/constants/mode';
import { useSourcedRef } from '@/composables/useSourcedRef';
import BaseForm from '@/components/ui/BaseForm.vue';

const authStore = useAuthStore();

const baseDialog = useTemplateRef('baseDialog');

const settingsStore = useSettingsStore();

const { t } = useI18n({ useScope: 'local' });

const [model, resetModel] = useSourcedRef(() => settingsStore.settings);

const onConfirm = () => settingsStore.saveSettings(model.value);

const onClose = resetModel;

const onClickAuthorize = async () => {
  if (!isDevelopment) {
    return;
  }

  await authStore.postAuth('dev-jwt');
  baseDialog.value?.close();
};

defineExpose({
  open: () => baseDialog.value?.open(),
  close: () => baseDialog.value?.close(),
});
</script>

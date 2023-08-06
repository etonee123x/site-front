<template>
  <BaseDialog
    ref="dialog"
    title="Settings"
    class="dialog-settings"
    width="20rem"
    height="20rem"
    @close="onDialogClose"
    @confirm="onDialogConfirm"
  >
    <div class="dialog-settings__content">
      <div class="dialog-settings__row">
        <span>Color:</span>
        <BaseSelect
          v-model="themeColor"
          class="dialog-settings__select dialog-settings__select_colors"
          :options="themeColorOptions"
        />
      </div>
      <div class="dialog-settings__row">
        <span>Mode:</span>
        <BaseSelect v-model="themeMode" class="dialog-settings__select" :options="themeModeOptions" />
      </div>
      <BaseButton @click="onClickResetSettings">
        Reset Settings
      </BaseButton>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { watch, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useSettingsStore } from '@/stores/settings';
import { addId } from '@/utils';

import BaseDialog from '@/components/BaseDialog.vue';
import BaseSelect from '@/components/BaseSelect';

import { DynamicComponent, THEME_COLOR, THEME_MODE } from '@/types';
import BaseButton from './BaseButton.vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [boolean];
}>();

const settingsStore = useSettingsStore();

const { settings } = storeToRefs(settingsStore);

const dialog = ref<DynamicComponent & { theDialog: HTMLDialogElement } | null>(null);

const themeColorOptions = Object.values(THEME_COLOR)
  .map(color => addId({ text: color, value: color, class: `theme_color_${color}` }));

const themeModeOptions = Object.values(THEME_MODE)
  .map(mode => addId({ text: mode, value: mode }));

const model = ref(settings.value);

const themeColor = computed({
  get: () => themeColorOptions.find(({ value }) => value === model.value.themeColor) || themeColorOptions[0],
  set: v => { model.value.themeColor = v.value; },
});

const themeMode = computed({
  get: () => themeModeOptions.find(({ value }) => value === model.value.themeMode) || themeModeOptions[0],
  set: v => { model.value.themeMode = v.value; },
});

const onDialogClose = () => emit('update:modelValue', false);

const onDialogConfirm = () => {
  settingsStore.setSettings(model.value);
  settingsStore.saveSettings();

  onDialogClose();
};

const onClickResetSettings = () => {
  settingsStore.resetSettings();
  model.value = settings.value;

  onDialogClose();
};

watch(
  () => props.modelValue,
  value => {
    if (!value) {
      return;
    }

    dialog.value?.theDialog.showModal();
  },
);
</script>

<style lang="scss" scoped>
.dialog-settings {

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__select {
    width: 8rem;

    &:deep(.select__option-text) {
      text-transform: capitalize;
    }

    &_colors {
      &:deep(.select__option:not(.theme_color_random, .select__option_selected)) {
        color: var(--color-details)
      }
    }
  }
}
</style>

<template>
  <BaseDialog
    ref="refDialog"
    title="Settings"
    width="20rem"
    height="20rem"
    @close="onDialogClose"
    @confirm="onDialogConfirm"
  >
    <div :class="$style.content">
      <div :class="$style.row">
        <span>Color:</span>
        <BaseSelect v-model="themeColor" :class="[$style.select, $style.select_colors]" :options="themeColorOptions" />
      </div>
      <div :class="$style.row">
        <span>Mode:</span>
        <BaseSelect v-model="themeMode" :class="$style.select" :options="themeModeOptions" />
      </div>
      <BaseButton @click="onClickResetSettings">Reset Settings</BaseButton>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { watch, ref, computed, useCssModule } from 'vue';
import { storeToRefs } from 'pinia';

import { useSettingsStore } from '@/stores/settings';
import { addId } from '@/utils';
import BaseDialog from '@/components/BaseDialog.vue';
import BaseSelect from '@/components/BaseSelect';
import BaseButton from '@/components/BaseButton.vue';
import { THEME_COLOR, THEME_MODE } from '@/types';

const isOpened = defineModel<boolean>();

const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);

const refDialog = ref<InstanceType<typeof BaseDialog>>();

const $style = useCssModule();

const themeColorOptions = Object.values(THEME_COLOR).map((color) => addId({ text: color, value: color }));

const themeModeOptions = Object.values(THEME_MODE).map((mode) => addId({ text: mode, value: mode }));

const model = ref(settings.value);

const themeColor = computed({
  get: () => themeColorOptions.find(({ value }) => value === model.value.themeColor) || themeColorOptions[0],
  set: (v) => {
    model.value.themeColor = v.value;
  },
});

const themeMode = computed({
  get: () => themeModeOptions.find(({ value }) => value === model.value.themeMode) || themeModeOptions[0],
  set: (v) => {
    model.value.themeMode = v.value;
  },
});

const onDialogClose = () => {
  isOpened.value = false;
};

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

watch(isOpened, (value) => {
  if (!value) {
    return;
  }

  refDialog.value?.refDialog?.showModal();
});
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

  --select__option--text-transform: capitalize;
}
</style>

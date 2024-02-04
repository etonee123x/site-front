<template>
  <header :class="$style.header">
    <div :class="[$style.inner, 'l-container']">
      <span :class="[$style.logo, 'f-h1']">eto_ne_E123x</span>
      <BaseIcon :path="mdiCog" :class="$style.settings" @click="onIconSettingsClick" />
    </div>
    <DialogSettings v-model="isDialogSettingsOpened" />
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mdiCog } from '@mdi/js';

import BaseIcon from '@/components/BaseIcon.vue';
import DialogSettings from '@/components/TheHeader/components/DialogSettings.vue';

const isDialogSettingsOpened = ref(false);

const onIconSettingsClick = () => {
  isDialogSettingsOpened.value = true;
};
</script>

<style lang="scss" module>
.header {
  border-bottom: var(--color-details) 1px solid;
}

.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.settings {
  display: flex;
  align-items: center;
  justify-items: center;
  cursor: pointer;
}
</style>

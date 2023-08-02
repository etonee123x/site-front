<template>
  <header class="header">
    <div class="header__inner l-container">
      <span class="header__logo">eto_ne_E123x</span>
      <span class="header__settings" @click="onIconSettingsClick">
        <BaseIcon :path="mdiCog" />
      </span>
    </div>
    <TheDialogSettings v-model="isDialogSettingsOpened" />
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mdiCog } from '@mdi/js';

import BaseIcon from '@/components/BaseIcon.vue';
import TheDialogSettings from '@/components/TheDialogSettings.vue';

const isDialogSettingsOpened = ref(false);

const onIconSettingsClick = () => {
  isDialogSettingsOpened.value = true;
};
</script>

<style lang="scss" scoped>
.header {
  border-bottom: var(--color-details) 1px solid;

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0;
  }

  &__settings {
    display: flex;
    align-items: center;
    justify-items: center;
  }
}
</style>

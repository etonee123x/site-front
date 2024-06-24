<template>
  <div class="l-container" :class="$style.view404">
    <div class="text-6xl">404</div>
    <RouterLink :to="{ name: RouteName.Home }" class="text-xl">{{ t('mainPage') }}</RouterLink>
  </div>
</template>

<i18n lang="yaml">
En:
  mainPage: 'To home'
Ru:
  mainPage: 'На главную'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { RouteName } from '@/router';

const { t } = useI18n({ useScope: 'local' });
</script>

<style lang="scss" module>
.view404 {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  gap: 1.5rem;
  flex-direction: column;
}
</style>

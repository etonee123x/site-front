<template>
  <div class="layout-container mx-auto flex justify-center items-center flex-1 gap-6 flex-col">
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

<template>
  <BasePage class="mx-auto flex justify-center items-center flex-1 gap-6 flex-col">
    <div class="text-6xl">404</div>
    <RouterLink :to="{ name: RouteName.Home }" class="text-xl">
      {{ t('mainPage') }}
    </RouterLink>
  </BasePage>
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
import BasePage from '@/components/ui/BasePage.vue';

const { t } = useI18n({ useScope: 'local' });
</script>

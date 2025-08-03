<template>
  <BasePage h1="404" class="mx-auto flex justify-center items-center flex-1 flex-col">
    <RouterLink :to="{ name: RouteName.Home }" class="text-xl">
      {{ t('toMain') }}
    </RouterLink>
  </BasePage>
</template>

<i18n lang="yaml">
En:
  toMain: 'To main'
Ru:
  toMain: 'На главную'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { RouteName } from '@/router';
import BasePage from '@/components/ui/BasePage.vue';

const { t } = useI18n({ useScope: 'local' });
</script>

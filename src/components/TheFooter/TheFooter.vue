<template>
  <footer class="border-t border-t-dark">
    <div class="layout-container mx-auto py-2 flex gap-2 items-center">
      <a target="_blank" :href="TELEGRAM_LINK">
        <img class="size-6" src="./assets/icons/Logo.svg" :alt="t('telegramLogo')" />
      </a>
    </div>
  </footer>
</template>

<i18n lang="yaml">
Ru:
  telegramLogo: Логотип телеграм
En:
  telegramLogo: Telegram logo
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const TELEGRAM_LINK = String(import.meta.env.VITE_TELEGRAM_LINK);

const { t } = useI18n({ useScope: 'local' });
</script>

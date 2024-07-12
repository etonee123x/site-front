<template>
  <footer class="border-t border-t-dark">
    <div class="l-container py-2 flex gap-2 items-center">
      <div>{{ t('me') }}</div>
      <a target="_blank" :href="telegramLink">
        <img class="w-6 h-6" src="/src/components/TheFooter/assets/icons/Logo.svg" />
      </a>
    </div>
  </footer>
</template>

<i18n lang="yaml">
Ru:
  me: 'Я'
En:
  me: 'Me'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });

const telegramLink = String(import.meta.env.VITE_TELEGRAM_LINK);
</script>

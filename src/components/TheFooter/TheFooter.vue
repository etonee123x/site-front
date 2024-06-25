<template>
  <footer :class="$style.footer">
    <div class="l-container" :class="$style.inner">
      <div>{{ t('contacts') }}</div>
      <a :href="link">
        <img :class="$style.img" src="/src/components/TheFooter/assets/icons/Logo.svg" />
      </a>
    </div>
  </footer>
</template>

<i18n lang="yaml">
Ru:
  contacts: 'Контакты'
En:
  contacts: 'Contacts'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });

const link = String(import.meta.env.VITE_TELEGRAM_LINK);
</script>

<style lang="scss" module>
.footer {
  border-top: 1px var(--color-dark) solid;
}
.img {
  width: 1.5rem;
  height: 1.5rem;
}
.inner {
  padding: 0.5rem 0;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>

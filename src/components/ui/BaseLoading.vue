<template>
  <span :class="$style.loading">
    <span v-if="isFull" :class="$style.indicator">{{ t('loading') }}</span>
    <span v-else :class="[$style.indicator, $style.indicator_notFull]" />
  </span>
</template>

<i18n lang="yaml">
En:
  loading: 'Loading'
Ru:
  loading: 'Загрузка'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
  isFull?: boolean;
}>();

const { t } = useI18n({ useScope: 'local' });
</script>

<style lang="scss" module>
.indicator {
  position: relative;

  &::after {
    content: '.';
    position: absolute;
    inset-inline-start: 100%;
    animation: loading 2s infinite;
  }

  &_notFull {
    &::after {
      transform: translateX(-50%);
    }
  }
}

@keyframes loading {
  0% {
    content: '.';
  }

  33% {
    content: '..';
  }

  67% {
    content: '...';
  }
}
</style>

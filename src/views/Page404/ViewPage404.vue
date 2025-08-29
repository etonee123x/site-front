<template>
  <BasePage h1="404" class="mx-auto flex justify-center items-center flex-1 flex-col">
    <p>{{ t('pageNotFound') }}</p>
    <I18nT keypath="tryReturning" tag="p">
      <RouterLink :to="{ name: RouteName.Home }" class="underline">
        {{ t('toTheMainPage') }}
      </RouterLink>
    </I18nT>
  </BasePage>
</template>

<i18n lang="yaml">
En:
  pageNotFound: 'Page not found. It may have been removed or the URL is incorrect.'
  tryReturning: Try returning {0}.
  toTheMainPage: 'to the main page'
Ru:
  pageNotFound: 'Страница не найдена. Возможно, она была удалена или вы ошиблись в адресе.'
  tryReturning: Попробуйте вернуться {0}.
  toTheMainPage: 'на главную страницу'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { RouteName } from '@/router';
import BasePage from '@/components/ui/BasePage.vue';
import { useSeoMeta } from '@unhead/vue';
import { useSSRContext } from '@/composables/useSSRContext';
import { isServer } from '@/constants/target';

const { t } = useI18n({ useScope: 'local' });

useSeoMeta({
  description: () => t('pageNotFound'),
});

if (isServer) {
  const ssrContext = useSSRContext();

  ssrContext?.express.response.status(404);
}
</script>

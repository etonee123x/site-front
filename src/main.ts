import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Vue3TouchEvents from 'vue3-touch-events';

import { router } from '@/router';
import { i18n } from '@/i18n';
import { useSettingsStore } from '@/stores/settings';
import { getConfig } from '@/api';
import App from '@/App.vue';

getConfig()
  .then((config) => {
    window.CONFIG = config;
  })
  .catch(console.error)
  .finally(() => {
    createApp(App).use(createPinia()).use<[]>(Vue3TouchEvents).use(router).use(i18n).mount('#app');

    useSettingsStore().initSettings();
  });

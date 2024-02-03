import { createApp } from 'vue';
import { createPinia } from 'pinia';

import router from '@/router';
import { useSettingsStore } from '@/stores/settings';
import { getConfig } from '@/api';

import App from '@/App.vue';

getConfig()
  .then(config => { window.CONFIG = config; })
  .catch(console.error)
  .finally(() => {
    createApp(App)
      .use(createPinia())
      .use(router)
      .mount('#app');

    useSettingsStore().initSettings();
  });

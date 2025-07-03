import { useCookies } from '@vueuse/integrations/useCookies.mjs';
import { createApp } from './main';
import { createHead } from '@unhead/vue/client';

const { app, router, pinia, i18n } = createApp();

const head = createHead();

app.use(head);

if (globalThis.__PINIA__) {
  pinia.state.value = globalThis.__PINIA__;
}

const cookies = useCookies();

i18n.global.locale.value = cookies.get('language');

router.isReady().then(() => app.mount('#app', true));

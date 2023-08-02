import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import { createPinia } from 'pinia';

if (!matchMedia('(hover: none)').matches) {
  document.body.classList.add('hoverable');
}

fetch('/config.json')
  .then(r =>
    r.json()
      .then(rJsoned => { window.CONFIG = rJsoned; })
      .catch(console.error),
  )
  .finally(() => {
    createApp(App)
      .use(createPinia())
      .use(router)
      .mount('#app');
  });

import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import { createPinia } from 'pinia';

if (!matchMedia('(hover: none)').matches) {
  document.body.classList.add('hoverable');
}

createApp(App).use(createPinia()).use(router).mount('#app');

import { createRouter, createWebHistory } from 'vue-router';
import { ROUTES_NAMES } from '@/types';

export default createRouter({
  routes: [
    {
      name: ROUTES_NAMES.EXPLORER,
      path: '/explorer/:link*',
      component: () => import('@/views/explorer/ExplorerView.vue'),
    },
    {
      name: ROUTES_NAMES.HOME,
      path: '/',
      redirect: '/explorer/',
    },
  ],
  history: createWebHistory('/'),
});

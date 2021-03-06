import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/explorer/:link*',
    component: () => import('@/views/explorer/ExplorerView.vue'),
  },
  {
    path: '/',
    redirect: '/explorer/',
  },
];

export const router = createRouter({
  routes,
  history: createWebHistory('/'),
});

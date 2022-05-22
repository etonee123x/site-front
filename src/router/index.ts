import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/explorer/:link*',
    component: () => import('@/views/ExplorerView.vue'),
  },
];

export const router = createRouter({
  routes,
  history: createWebHistory('/'),
});

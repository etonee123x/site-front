import { createRouter, createWebHistory } from 'vue-router';

export enum ROUTE_NAME {
  EXPLORER = 'EXPLORER',
  HOME = 'HOME',
}

export const router = createRouter({
  routes: [
    {
      name: ROUTE_NAME.EXPLORER,
      path: '/explorer/:links*',
      component: () => import('@/views/explorer'),
    },
    {
      name: ROUTE_NAME.HOME,
      path: '/',
      redirect: '/explorer/',
    },
  ],
  history: createWebHistory('/'),
});

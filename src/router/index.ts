import { createRouter, createWebHistory } from 'vue-router';

export enum ROUTE_NAME {
  EXPLORER = 'EXPLORER',
  HOME = 'HOME',
}

export default createRouter({
  routes: [
    {
      name: ROUTE_NAME.EXPLORER,
      path: '/explorer/:link*',
      component: () => import('@/views/explorer/ExplorerView.vue'),
    },
    {
      name: ROUTE_NAME.HOME,
      path: '/',
      redirect: '/explorer/',
    },
  ],
  history: createWebHistory('/'),
});

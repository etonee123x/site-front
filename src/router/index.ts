import { createRouter, createWebHistory } from 'vue-router';

export enum RouteName {
  Explorer = 'Explorer',
  Home = 'Home',
}

export const router = createRouter({
  routes: [
    {
      name: RouteName.Explorer,
      path: '/explorer/:links*',
      component: () => import('@/views/explorer'),
    },
    {
      name: RouteName.Home,
      path: '/',
      redirect: '/explorer/',
    },
  ],
  history: createWebHistory('/'),
});

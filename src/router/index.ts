import { createRouter, createWebHistory } from 'vue-router';

import { checkAuth } from './guards/checkAuth';

import { setToken } from '@/router/guards/setToken';

export enum RouteName {
  Explorer = 'Explorer',
  Home = 'Home',
  Blog = 'Blog',
  Auth = 'Auth',
}

export const router = createRouter({
  routes: [
    {
      name: RouteName.Explorer,
      path: '/explorer/:links*',
      component: () => import('@/views/Explorer'),
    },
    {
      name: RouteName.Home,
      path: '/',
      redirect: '/explorer/',
    },
    {
      name: RouteName.Blog,
      path: '/blog',
      component: () => import('@/views/Blog'),
    },
  ],
  history: createWebHistory('/'),
});

router.beforeEach(setToken);
router.beforeEach(checkAuth);

import { createRouter, createWebHistory } from 'vue-router';

export enum RouteName {
  Explorer = 'Explorer',
  Home = 'Home',
  Blog = 'Blog',
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

import { createMemoryHistory, createRouter as _createRouter, createWebHistory } from 'vue-router';

import { isServer } from '@/constants/target';

export enum RouteName {
  Explorer = 'Explorer',
  Home = 'Home',
  Blog = 'Blog',
  BlogPost = 'BlogPost',
  Auth = 'Auth',
  Page404 = 'Page404',
}

export const createRouter = () =>
  _createRouter({
    routes: [
      {
        name: RouteName.Explorer,
        path: '/explorer/:links*',
        component: () => import('@/views/Explorer'),
      },
      {
        name: RouteName.Home,
        path: '/',
        redirect: '/blog',
      },
      {
        path: '/blog',
        children: [
          {
            name: RouteName.Blog,
            path: '',
            component: () => import('@/views/Blog'),
          },
          {
            name: RouteName.BlogPost,
            path: ':postId',
            component: () => import('@/views/Blog'),
          },
        ],
      },
      {
        name: RouteName.Page404,
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/Page404'),
      },
    ],
    history: isServer ? createMemoryHistory() : createWebHistory('/'),
  });

import { createRouter, createWebHistory } from 'vue-router';

import { checkAuth } from './guards/checkAuth';
import { setToken } from './guards/setToken';

export enum RouteName {
  Explorer = 'Explorer',
  Home = 'Home',
  Blog = 'Blog',
  BlogPost = 'BlogPost',
  Auth = 'Auth',
  Page404 = 'Page404',
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
  history: createWebHistory('/'),
});

router.beforeEach(setToken);
router.beforeEach(checkAuth);

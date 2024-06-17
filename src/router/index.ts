import { createRouter, createWebHistory } from 'vue-router';
import { storeToRefs } from 'pinia';

import { doesQueryParamEqualTrue } from '@/composables/doesQueryParamEqualTrue';
import { useAuthStore } from '@/stores/auth';
import { TOKEN } from '@/constants';

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
      beforeEnter: (...[to, , next]) => {
        const authStore = useAuthStore();
        const { isAdmin } = storeToRefs(authStore);

        switch (true) {
          case !doesQueryParamEqualTrue('admin', to).value:
          case isAdmin.value:
            return next();
          default:
            return next({ name: RouteName.Auth });
        }
      },
    },
  ],
  history: createWebHistory('/'),
});
router.beforeEach((to) => {
  const maybeToken = to.query[TOKEN];
  if (!maybeToken) {
    return;
  }
  const authStore = useAuthStore();
  const { token } = storeToRefs(authStore);
  token.value = String(maybeToken);
});

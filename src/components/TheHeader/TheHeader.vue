<template>
  <header class="border-b border-b-details-500 relative">
    <ClientOnly v-if="loadingStore.isLoading">
      <div
        class="after:opacity-30 after:absolute after:bottom-0 after:translate-y-1/2 after:h-1 after:rounded-full after:z-[calc(var(--z-index-explorer-navbar)+1)] after:w-1/6 after:bg-dark after:animate-runner"
      />
    </ClientOnly>
    <div class="layout-container mx-auto flex items-center py-2 gap-4">
      <nav class="flex items-end gap-4">
        <RouterLink :to class="text-xl">{{ siteTitle }}</RouterLink>
        <ul class="flex gap-2">
          <li v-for="link in links" :key="link.key">
            <RouterLink :to="link.to" activeClass="text-details-500">
              {{ link.text }}
            </RouterLink>
          </li>
        </ul>
      </nav>
      <ul class="text-2xl ms-auto flex gap-1">
        <li v-for="button in buttons" :key="button.key">
          <BaseButton :aria-label="button.ariaLabel" @click="button.onClick">
            <BaseIcon :path="button.path" />
          </BaseButton>
        </li>
      </ul>
    </div>
    <DialogSettings ref="dialogSettings" />
  </header>
</template>

<i18n lang="yaml">
Ru:
  content: 'Контент'
  blog: 'Блог'
  openSettings: 'Открыть настройки'
  logout: 'Логаут'
En:
  content: 'Content'
  blog: 'Blog'
  openSettings: 'Open Settings'
  logout: 'Logout'
</i18n>

<script setup lang="ts">
import { mdiLogout, mdiCog } from '@mdi/js';
import { computed, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

import DialogSettings from './components/DialogSettings.vue';

import BaseIcon from '@/components/ui/BaseIcon';
import { RouteName } from '@/router';
import { useAuthStore } from '@/stores/auth';
import BaseButton from '@/components/ui/BaseButton';
import { useLoadingStore } from '@/stores/loading';
import ClientOnly from '@/components/ClientOnly.vue';

const dialogSettings = useTemplateRef('dialogSettings');

const { t } = useI18n({ useScope: 'local' });

const loadingStore = useLoadingStore();

const authStore = useAuthStore();

const siteTitle = String(import.meta.env.VITE_SITE_TITLE);

const to = { name: RouteName.Home };

const links = computed(() => [
  {
    text: t('content'),
    to: {
      name: RouteName.Explorer,
    },
    key: 'content',
  },
  {
    text: t('blog'),
    to: {
      name: RouteName.Blog,
    },
    key: 'blog',
  },
]);

const buttons = computed(() => [
  ...(authStore.isAdmin
    ? [
        {
          key: 'logout',
          path: mdiLogout,
          ariaLabel: t('logout'),
          onClick: authStore.deleteAuth,
        },
      ]
    : []),
  {
    key: 'open-settings',
    path: mdiCog,
    ariaLabel: t('openSettings'),
    onClick: () => dialogSettings.value?.open(),
  },
]);
</script>

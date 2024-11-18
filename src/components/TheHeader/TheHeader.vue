<template>
  <header class="border-b border-b-details-500">
    <div class="l-container flex items-center py-2 gap-4">
      <nav class="flex items-end gap-4">
        <RouterLink :to class="text-xl">{{ siteTitle }}</RouterLink>
        <ul class="flex gap-2">
          <li v-for="link in links" :key="link.id">
            <RouterLink :to="link.to" activeClass="text-details-500">
              {{ link.text }}
            </RouterLink>
          </li>
        </ul>
      </nav>
      <ul class="text-2xl ms-auto flex gap-1">
        <li v-for="icon in icons" :key="icon.id">
          <BaseButton @click="icon.onClick">
            <BaseIcon :path="icon.path" />
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
En:
  content: 'Content'
  blog: 'Blog'
</i18n>

<script setup lang="ts">
import { mdiAccountCircleOutline, mdiCog } from '@mdi/js';
import { computed, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

import DialogSettings from './components/DialogSettings.vue';

import { logout } from '@/helpers/logout';
import BaseIcon from '@/components/ui/BaseIcon';
import { RouteName } from '@/router';
import { useAuthStore } from '@/stores/auth';
import BaseButton from '@/components/ui/BaseButton';

const { t } = useI18n({ useScope: 'local' });

const dialogSettings = useTemplateRef('dialogSettings');

const authStore = useAuthStore();

const siteTitle = String(import.meta.env.VITE_SITE_TITLE);

const to = { name: RouteName.Home };

const links = computed(() => [
  { text: t('content'), to: { name: RouteName.Explorer }, id: 0 },
  { text: t('blog'), to: { name: RouteName.Blog }, id: 1 },
]);

const icons = computed(() => [
  ...(authStore.isAdmin
    ? [
        {
          id: 0,
          path: mdiAccountCircleOutline,
          onClick: logout,
        },
      ]
    : []),
  {
    id: 1,
    path: mdiCog,
    onClick: () => dialogSettings.value?.open(),
  },
]);
</script>

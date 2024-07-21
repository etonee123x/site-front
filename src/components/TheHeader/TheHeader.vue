<template>
  <header class="border-b border-b-details-500 z-10 bg-background">
    <div class="l-container flex items-center py-2 gap-4">
      <RouterLink :to="to" class="text-xl">{{ siteTitle }}</RouterLink>
      <ul class="flex gap-2">
        <li v-for="link in links" :key="link.id">
          <RouterLink :to="link.to" active-class="text-details-500">
            {{ link.text }}
          </RouterLink>
        </li>
      </ul>
      <ul class="text-2xl ms-auto flex gap-1">
        <li v-for="icon in icons" :key="icon.id">
          <BaseIcon :path="icon.path" @click="icon.onClick" />
        </li>
      </ul>
    </div>
    <DialogSettings ref="refDialogSettings" />
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
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';

import DialogSettings from './components/DialogSettings.vue';

import { logout } from '@/helpers/logout';
import BaseIcon from '@/components/ui/BaseIcon.vue';
import { addId } from '@/utils';
import { RouteName } from '@/router';
import { useAuthStore } from '@/stores/auth';

const { t } = useI18n({ useScope: 'local' });

const refDialogSettings = ref<InstanceType<typeof DialogSettings>>();

const authStore = useAuthStore();
const { isAdmin } = storeToRefs(authStore);

const siteTitle = String(import.meta.env.VITE_SITE_TITLE);

const to = { name: RouteName.Home };

const links = computed(() =>
  [
    { text: t('content'), to: { name: RouteName.Explorer } },
    { text: t('blog'), to: { name: RouteName.Blog } },
  ].map(addId),
);

const icons = computed(() =>
  [
    ...(isAdmin.value
      ? [
          {
            path: mdiAccountCircleOutline,
            onClick: logout,
          },
        ]
      : []),
    {
      path: mdiCog,
      onClick: () => refDialogSettings.value?.open(),
    },
  ].map(addId),
);
</script>

<template>
  <header class="border-b border-b-details-500">
    <div class="l-container flex items-center py-2 gap-4">
      <RouterLink :to="to" class="text-xl">eto-ne-e123x</RouterLink>
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
    <DialogSettings v-model="isDialogSettingsOpened" />
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
import { useToggle } from '@vueuse/core';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';

import { DialogSettings } from './components';

import { logout } from '@/helpers/logout';
import BaseIcon from '@/components/ui/BaseIcon.vue';
import { addId } from '@/utils';
import { RouteName } from '@/router';
import { useAuthStore } from '@/stores/auth';

const { t } = useI18n({ useScope: 'local' });

const [isDialogSettingsOpened, toggleIsDialogSettingsOpened] = useToggle();

const authStore = useAuthStore();
const { isAdmin } = storeToRefs(authStore);

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
      onClick: () => toggleIsDialogSettingsOpened(true),
    },
  ].map(addId),
);
</script>

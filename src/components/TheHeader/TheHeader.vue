<template>
  <header :class="$style.header">
    <div class="l-container" :class="$style.inner">
      <RouterLink :to="to" class="text-xl">eto-ne-e123x</RouterLink>
      <ul :class="$style.links">
        <li v-for="link in links" :key="link.id">
          <RouterLink :class="$style.link" :to="link.to" :active-class="$style.link_active">
            {{ link.text }}
          </RouterLink>
        </li>
      </ul>
      <ul class="text-2xl" :class="$style.icons">
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

<style lang="scss" module>
.header {
  border-bottom: var(--color-details) 1px solid;
}

.inner {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  gap: 1rem;
}

.icons {
  margin-inline-start: auto;
  display: flex;
  gap: 0.25rem;
}

.links {
  display: flex;
  gap: 0.5rem;
}

.link {
  &_active {
    color: var(--color-details);
  }
}
</style>

<template>
  <header :class="$style.header">
    <div class="l-container" :class="$style.inner">
      <RouterLink :to="to" class="text-xl" :class="$style.logo">eto-ne-e123x</RouterLink>
      <ul :class="$style.links">
        <li v-for="link in links" :key="link.id">
          <RouterLink :class="$style.link" :to="link.to" :active-class="$style.link_active">
            {{ link.text }}
          </RouterLink>
        </li>
      </ul>
      <BaseButton :class="$style.settings" @click="onIconSettingsClick">
        <BaseIcon :path="mdiCog" class="text-3xl" />
      </BaseButton>
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
import { mdiCog } from '@mdi/js';
import { useToggle } from '@vueuse/core';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { DialogSettings } from './components';

import BaseIcon from '@/components/ui/BaseIcon.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { addId } from '@/utils';
import { RouteName } from '@/router';

const { t } = useI18n({ useScope: 'local' });

const [isDialogSettingsOpened, toggle] = useToggle();

const onIconSettingsClick = () => toggle(true);

const to = { name: RouteName.Home };

const links = computed(() =>
  [
    { text: t('content'), to: { name: RouteName.Explorer } },
    { text: t('blog'), to: { name: RouteName.Blog } },
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

.settings {
  margin-inline-start: auto;
  padding: 0.125rem;
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

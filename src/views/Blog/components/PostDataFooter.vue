<template>
  <div :class="$style.postDataFooter">
    <slot />
    <BaseVr />
    <BaseIcon :path="mdiLinkVariant" @click="onClickCopyUrl" />
  </div>
</template>

<i18n lang="yaml">
En:
  copied: 'Copied!'
Ru:
  copied: 'Скопировано!'
</i18n>

<script lang="ts" setup>
import { mdiLinkVariant } from '@mdi/js';
import type { Post } from '@shared/src/types';
import { useClipboard } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

import BaseVr from '@/components/ui/BaseVr.vue';
import BaseIcon from '@/components/ui/BaseIcon.vue';
import { useToastsStore } from '@/stores/toasts';

const props = defineProps<{
  post: Post;
}>();

const { t } = useI18n({ useScope: 'local' });

const { copy } = useClipboard({ legacy: true });

const toastsStore = useToastsStore();

const onClickCopyUrl = () => {
  const locationURL = new URL(window.location.href);

  locationURL.searchParams.set('postId', String(props.post.id));

  return copy(locationURL.href).then(() => toastsStore.toastSuccess(t('copied')));
};
</script>

<style lang="scss" module>
.postDataFooter {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  align-items: center;
  gap: 0.5rem;
}
</style>

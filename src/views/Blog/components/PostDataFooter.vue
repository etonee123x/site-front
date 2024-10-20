<template>
  <div class="flex justify-end mt-4 items-center gap-2">
    <slot />
    <BaseVr />
    <button @click="onClickCopyUrl">
      <BaseIcon :path="mdiLinkVariant" />
    </button>
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
import { type Post } from '@shared/src/types';
import { useClipboard } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

import BaseVr from '@/components/ui/BaseVr.vue';
import BaseIcon from '@/components/ui/BaseIcon';
import { useToastsStore } from '@/stores/toasts';

const props = defineProps<{
  post: Post;
}>();

const { t } = useI18n({ useScope: 'local' });

const { copy } = useClipboard({ legacy: true });

const toastsStore = useToastsStore();

const onClickCopyUrl = () =>
  copy(window.location.href.replace(/(?<=blog).*/, `/${props.post.id}`)).then(() =>
    toastsStore.toastSuccess(t('copied')),
  );
</script>

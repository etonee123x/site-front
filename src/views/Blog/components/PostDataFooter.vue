<template>
  <div class="flex justify-end items-center gap-2">
    <slot />
    <div :class="VR" class="my-1" />
    <BaseButton aria-label="t('copyPostLink')" @click.stop="onClickCopyUrl">
      <BaseIcon :path="mdiLinkVariant" />
    </BaseButton>
  </div>
</template>

<i18n lang="yaml">
En:
  copied: 'Copied!'
  copyPostLink: 'Copy post link'
Ru:
  copied: 'Скопировано!'
  copyPostLink: 'Скопировать ссылку на пост'
</i18n>

<script lang="ts" setup>
import { mdiLinkVariant } from '@mdi/js';
import type { Post } from '@etonee123x/shared/types/blog';
import { useClipboard } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

import BaseIcon from '@/components/ui/BaseIcon';
import { useToastsStore } from '@/stores/toasts';
import BaseButton from '@/components/ui/BaseButton';
import { VR } from '@/helpers/ui';

const props = defineProps<{
  post: Post;
}>();

const { t } = useI18n({ useScope: 'local' });

const { copy } = useClipboard({ legacy: true });

const toastsStore = useToastsStore();

const onClickCopyUrl = () =>
  copy(globalThis.location.href.replace(/(?<=blog).*/, `/${props.post.id}`)).then(() =>
    toastsStore.toastSuccess(t('copied')),
  );
</script>

<template>
  <BaseDialog ref="refDialog" :title="t('confirmDelete')" @close="onClose">
    <div class="flex flex-col gap-4">
      <p>{{ t('deleteMessage') }}</p>
      <div class="flex gap-2"></div>
    </div>
  </BaseDialog>
</template>

<i18n lang="yaml">
En:
  confirmDelete: 'Delete Post'
  deleteMessage: 'Are you sure you want to delete this post?'
  confirm: 'Confirm'
  cancel: 'Cancel'
Ru:
  confirmDelete: 'Удалить пост'
  deleteMessage: 'Вы уверены, что хотите удалить этот пост?'
  confirm: 'Подтвердить'
  cancel: 'Отмена'
</i18n>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Post } from '@shared/src/types';

import BaseDialog from '@/components/ui/BaseDialog.vue';

const { t } = useI18n({ useScope: 'local' });

const refDialog = ref<InstanceType<typeof BaseDialog>>();
const postToDelete = ref<Post | null>(null);

const openDialog = (post: Post) => {
  postToDelete.value = post;
  refDialog.value?.open();
};

const closeDialog = () => {
  refDialog.value?.close();
};

const onClose = () => {
  postToDelete.value = null;
};

defineExpose({
  open: openDialog,
  close: closeDialog,
});
</script>

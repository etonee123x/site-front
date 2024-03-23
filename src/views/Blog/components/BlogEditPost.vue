<template>
  <BaseTextarea ref="refTextarea" :placeholder="t('textareaPlaceholder')" v-bind="$props" />
</template>

<i18n lang="yaml">
Ru:
  textareaPlaceholder: 'Сообщение'
En:
  textareaPlaceholder: 'Message'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

import BaseTextarea from '@/components/BaseTextarea.vue';

const refTextarea = ref<InstanceType<typeof BaseTextarea>>();

const { t } = useI18n({ useScope: 'local' });

defineExpose({
  focus: () => refTextarea.value?.focus(),
});
</script>

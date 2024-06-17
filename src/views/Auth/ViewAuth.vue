<template>
  <div>
    <div>Страница авторизации</div>
    <pre>{{ token }}</pre>
    <pre>{{ model }}</pre>
    <BaseTextarea v-model="model"></BaseTextarea>
    <BaseButton @click="onClick">{{ t('enter') }}</BaseButton>
  </div>
</template>

<i18n lang="yaml">
Ru:
  enter: 'Войти'
En:
  enter: 'Enter'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

import BaseButton from '@/components/ui/BaseButton.vue';
import BaseTextarea from '@/components/ui/BaseTextarea.vue';
import { useAuthStore } from '@/stores/auth';

const { t } = useI18n({ useScope: 'local' });
const onClick = () => {
  token.value = model.value;
};
const authStore = useAuthStore();
const { token } = storeToRefs(authStore);
const model = ref('');
</script>

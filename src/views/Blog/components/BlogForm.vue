<template>
  <div :class="$style.blogForm">
    <BaseTextarea v-model="post.text" :placeholder="t('textareaPlaceholder')" />
    <BaseButton :is-loading="isLoading[IsLoadingAction.Post]" @click="onClickButton">{{ t('buttonLabel') }}</BaseButton>
  </div>
</template>

<i18n lang="yaml">
ru:
  textareaPlaceholder: 'Сообщение'
  buttonLabel: 'Отправить'
en:
  textareaPlaceholder: 'Message'
  buttonLabel: 'Post'
</i18n>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';

import BaseTextarea from '@/components/BaseTextarea.vue';
import BaseButton from '@/components/BaseButton.vue';
import { useBlogStore, IsLoadingAction } from '@/stores/blog';

const { t } = useI18n({ useScope: 'local' });

const blogStore = useBlogStore();
const { isLoading } = storeToRefs(blogStore);

const getInitialValuePost = () => ({
  text: '',
});

const post = ref(getInitialValuePost());

const onClickButton = () => {
  blogStore.postPost(post.value);

  post.value = getInitialValuePost();
};
</script>

<style lang="scss" module>
.blogForm {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
</style>

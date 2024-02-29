<template>
  <BaseForm :class="$style.blogForm" @submit.prevent="onSubmit">
    <BaseTextarea
      v-model="post.text"
      :placeholder="t('textareaPlaceholder')"
      :errors="v$.text.$errors"
      @submit="onSubmit"
    />
    <BaseButton :is-loading="isLoading[IsLoadingAction.Post]">{{ t('buttonLabel') }}</BaseButton>
  </BaseForm>
</template>

<i18n lang="yaml">
Ru:
  textareaPlaceholder: 'Сообщение'
  buttonLabel: 'Отправить'
En:
  textareaPlaceholder: 'Message'
  buttonLabel: 'Post'
</i18n>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useVuelidate } from '@vuelidate/core';

import { required } from '@/utils';
import BaseTextarea from '@/components/BaseTextarea.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseForm from '@/components/BaseForm.vue';
import { useBlogStore, IsLoadingAction } from '@/stores/blog';

const { t } = useI18n({ useScope: 'local' });

const rules = {
  text: { required },
};

const getInitialValuePost = () => ({
  text: '',
});

const post = ref(getInitialValuePost());

const v$ = useVuelidate(rules, post, { $lazy: true });

const blogStore = useBlogStore();
const { isLoading } = storeToRefs(blogStore);

const onSubmit = async () => {
  if (!(await v$.value.$validate())) {
    return;
  }

  blogStore.postPost(post.value);

  v$.value.$reset();

  post.value = getInitialValuePost();
};
</script>

<style lang="scss" module>
.blogForm {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>

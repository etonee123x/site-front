<template>
  <BaseForm :class="$style.blogForm" @submit.prevent="onSubmit">
    <BlogEditPost v-model="postData.text" :errors="v$.text.$errors" @submit="onSubmit" />
    <BaseButton :is-loading="isLoading[IsLoadingAction.Post]">{{ t('buttonLabel') }}</BaseButton>
  </BaseForm>
</template>

<i18n lang="yaml">
Ru:
  buttonLabel: 'Отправить'
En:
  buttonLabel: 'Post'
</i18n>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';

import { useVuelidateBlogPostData } from '@/views/Blog/composables';
import BaseButton from '@/components/BaseButton.vue';
import BaseForm from '@/components/BaseForm.vue';
import { useBlogStore, IsLoadingAction } from '@/stores/blog';
import BlogEditPost from '@/views/Blog/components/BlogEditPost.vue';

const { t } = useI18n({ useScope: 'local' });

const getInitialPostData = () => ({
  text: '',
});

const postData = ref(getInitialPostData());

const { v$, handle } = useVuelidateBlogPostData(async () => {
  blogStore.postPost(postData.value);

  v$.value.$reset();

  postData.value = getInitialPostData();
}, postData);

const blogStore = useBlogStore();
const { isLoading } = storeToRefs(blogStore);

const onSubmit = handle;
</script>

<style lang="scss" module>
.blogForm {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>

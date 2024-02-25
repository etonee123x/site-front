<template>
  <div :class="$style.post">
    <div :class="$style.postInner">
      <BaseButton
        v-if="isAdmin"
        :class="$style.iconDelete"
        :is-loading="isLoading[IsLoadingAction.Delete]"
        @click="() => onClickDelete(post.id)"
      >
        <BaseIcon :path="mdiDelete" />
      </BaseButton>
      <div>{{ post.text }}</div>
      <div :class="$style.createdAt">
        <span :title="createdAt.exact">{{ createdAt.humanReadable }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mdiDelete } from '@mdi/js';
import type { Post } from '@shared/src/types';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { intlFormatDistance } from 'date-fns';

import BaseIcon from '@/components/BaseIcon.vue';
import { useBlogStore, IsLoadingAction } from '@/stores/blog';
import BaseButton from '@/components/BaseButton.vue';

const blogStore = useBlogStore();
const { isAdmin, isLoading } = storeToRefs(blogStore);

const props = defineProps<{ post: Post }>();

const onClickDelete = blogStore.deletePost;

const createdAt = computed(() => ({
  humanReadable: intlFormatDistance(props.post.createdAt, new Date()),
  exact: String(new Date(props.post.createdAt)),
}));
</script>

<style lang="scss" module>
.post {
  width: 100%;
  border: var(--border-default);
  padding: 1rem;

  &:not(:hover) {
    .iconDelete {
      display: none;
    }
  }
}

.postInner {
  position: relative;
}

.iconDelete {
  position: absolute;
  inset-inline-end: 0;
  top: 0;
  cursor: pointer;
}

.createdAt {
  text-align: end;
}
</style>

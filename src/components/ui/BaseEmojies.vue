<template>
  <BasePopover :triggers="['click']">
    <BaseIcon :path="mdiEmoticonConfusedOutline" />
    <template #content>
      <div @click="onClickContent">Content!</div>
    </template>
  </BasePopover>
</template>

<script setup lang="ts">
import { mdiEmoticonConfusedOutline } from '@mdi/js';

import BasePopover from './BasePopover.vue';
import BaseIcon from './BaseIcon.vue';

const emit = defineEmits<{
  select: [string];
}>();

const onClickContent = () => emit('select', 'emoji!');
</script>

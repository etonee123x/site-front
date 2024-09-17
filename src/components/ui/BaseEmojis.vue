<template>
  <BasePopover ref="refBasePopover" :props-tippy="{ placement: 'bottom' }" :triggers="['manual']">
    <BaseIcon :path="mdiEmoticonConfusedOutline" @click="onClickActivator" />
    <template #content>
      <div v-for="(group, index) in dataByGroup" :key="group.slug">
        <div class="mb-2 text-xs">{{ group.name }}</div>
        <div class="grid grid-cols-9" :class="index < dataByGroup.length - 1 && 'mb-4'">
          <div
            v-for="emojiData in group.emojis"
            :key="emojiData.slug"
            class="cursor-pointer m-0.5 p-0.5 hover:bg-items-hovered rounded"
            @click="() => onClickEmoji(emojiData.emoji)"
          >
            {{ emojiData.emoji }}
          </div>
        </div>
      </div>
    </template>
  </BasePopover>
</template>

<script setup lang="ts">
import { mdiEmoticonConfusedOutline } from '@mdi/js';
import dataByGroup from 'unicode-emoji-json/data-by-group.json';
import { ref } from 'vue';

import BasePopover from './BasePopover.vue';
import BaseIcon from './BaseIcon.vue';

const emit = defineEmits<{
  select: [string];
}>();

const refBasePopover = ref<InstanceType<typeof BasePopover>>();

const onClickEmoji = (groupSlug: string) => emit('select', groupSlug);

const onClickActivator = () => refBasePopover.value?.show();
</script>

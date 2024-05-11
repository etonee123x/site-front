<template>
  <component :is="component.is" v-bind="component.binds">{{ fileUrl }}</component>
</template>

<script setup lang="ts">
import { isExtAudio, isExtPicture } from '@shared/src/types';
import { computed } from 'vue';

const props = defineProps<{
  fileUrl: string;
}>();

const component = computed(() => {
  const ext = props.fileUrl.match(/\.[^.]*$/)?.[0] ?? '';

  switch (true) {
    case isExtPicture(ext):
      return {
        is: 'img',
        binds: {
          src: props.fileUrl,
        },
      };
    case isExtAudio(ext):
      return {
        is: 'audio',
        binds: {
          src: props.fileUrl,
          controls: true,
        },
      };
    default:
      return {
        is: 'a',
        binds: {
          href: props.fileUrl,
        },
      };
  }
});
</script>

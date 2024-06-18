<template>
  <component :is="component.is" :class="$s.postDataAttachment" v-bind="component.binds">{{ fileUrl }}</component>
</template>

<script setup lang="ts">
import { isExtAudio, isExtImage } from '@shared/src/types';
import { computed } from 'vue';

const props = defineProps<{
  fileUrl: string;
}>();

const component = computed(() => {
  const ext = props.fileUrl.match(/\.[^.]*$/)?.[0] ?? '';

  switch (true) {
    case isExtImage(ext):
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

<style lang="scss" module="$s">
.postDataAttachment {
  max-width: 100%;
}
</style>

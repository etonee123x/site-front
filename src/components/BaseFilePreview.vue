<template>
  <component :is="component.is" v-bind="component.binds" />
</template>

<script setup lang="ts">
import { mdiTextBoxOutline, mdiFileOutline } from '@mdi/js';
import { defineAsyncComponent, computed } from 'vue';

const LazyBaseIcon = defineAsyncComponent(() => import('@/components/BaseIcon.vue'));

const props = defineProps<{
  file: File;
}>();

const component = computed(() => {
  const isMimeImage = (_string: string) => _string.startsWith('image');
  const isMimeAudio = (_string: string) => _string.startsWith('audio');
  const isMimeVideo = (_string: string) => _string.startsWith('video');
  const isMimeText = (_string: string) => _string.startsWith('text');

  switch (true) {
    case isMimeImage(props.file.type):
      return {
        is: 'img',
        binds: {
          src: URL.createObjectURL(props.file),
          style: {
            maxWidth: '2rem',
          },
        },
      };
    case isMimeAudio(props.file.type):
      return {
        is: 'audio',
        binds: {
          src: URL.createObjectURL(props.file),
          controls: true,
        },
      };
    case isMimeVideo(props.file.type):
      return {
        is: 'video',
        binds: {
          src: URL.createObjectURL(props.file),
          controls: true,
        },
      };
    case isMimeText(props.file.type):
      return {
        is: LazyBaseIcon,
        binds: {
          path: mdiTextBoxOutline,
          size: '2rem',
        },
      };
    default:
      return {
        is: LazyBaseIcon,
        binds: {
          path: mdiFileOutline,
          size: '2rem',
        },
      };
  }
});
</script>

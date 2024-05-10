<template>
  <component :is="component.is" v-bind="component.binds" />
</template>

<script setup lang="ts">
import { mdiFileOutline } from '@mdi/js';
import { isExtAudio, isExtPicture } from '@shared/src/types';
import { defineAsyncComponent, computed } from 'vue';

const LazyBaseIcon = defineAsyncComponent(() => import('@/components/BaseIcon.vue'));

const props = defineProps<{
  file: File;
}>();

const component = computed(() => {
  const ext = props.file.type.replace(/.*\//, '.');

  switch (true) {
    case isExtPicture(ext):
      return {
        is: 'img',
        binds: {
          src: URL.createObjectURL(props.file),
          style: {
            width: '4rem',
            height: '4rem',
            objectFit: 'contain',
          },
        },
      };
    case isExtAudio(ext):
      return {
        is: 'audio',
        binds: {
          src: URL.createObjectURL(props.file),
          controls: true,
        },
      };
    // case isMimeVideo(props.file.type):
    //   return {
    //     is: 'video',
    //     binds: {
    //       src: URL.createObjectURL(props.file),
    //       controls: true,
    //     },
    //   };
    // case isMimeText(props.file.type):
    //   return {
    //     is: LazyBaseIcon,
    //     binds: {
    //       path: mdiTextBoxOutline,
    //       size: '2rem',
    //     },
    //   };
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

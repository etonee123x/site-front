<template>
  <component :is="component.is" v-bind="component.binds" />
</template>

<script setup lang="ts">
import { mdiFileOutline } from '@mdi/js';
import { isExtAudio, isExtImage, isExtVideo } from '@etonee123x/shared/helpers/folderData';
import { defineAsyncComponent, computed } from 'vue';

const LazyBaseIcon = defineAsyncComponent(() => import('@/components/ui/BaseIcon'));
const LazyPreviewVideo = defineAsyncComponent(() => import('@/components/PreviewVideo.vue'));

const props = defineProps<{ file: File }>();

const component = computed(() => {
  const ext = props.file.type.replace(/.*\//, '.');

  switch (true) {
    case isExtImage(ext):
      return {
        is: 'img',
        binds: {
          src: URL.createObjectURL(props.file),
          style: {
            maxWidth: '10rem',
            maxHeight: '10rem',
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
    case isExtVideo(ext):
      return {
        is: LazyPreviewVideo,
        binds: {
          src: URL.createObjectURL(props.file),
          controls: true,
          style: {
            maxWidth: '10rem',
            maxHeight: '10rem',
          },
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

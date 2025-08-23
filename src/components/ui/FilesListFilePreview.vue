<template>
  <component :is="component.is" v-bind="component.binds" />
</template>

<script setup lang="ts">
import { extensionToFileType, FILE_TYPES } from '@etonee123x/shared/helpers/folderData';
import { mdiFileOutline } from '@mdi/js';
import { defineAsyncComponent, computed } from 'vue';

const LazyBaseIcon = defineAsyncComponent(() => import('@/components/ui/BaseIcon'));
const LazyPreviewVideo = defineAsyncComponent(() => import('@/components/PreviewVideo.vue'));

const props = defineProps<{ file: File }>();

const component = computed(() => {
  switch (extensionToFileType(props.file.type.replace(/.*\//, '.'))) {
    case FILE_TYPES.IMAGE:
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
    case FILE_TYPES.AUDIO:
      return {
        is: 'audio',
        binds: {
          src: URL.createObjectURL(props.file),
          controls: true,
        },
      };
    case FILE_TYPES.VIDEO:
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

<template>
  <component :is="component.is" :class="$s.postDataAttachment" v-bind="component.binds" />
</template>

<script setup lang="ts">
import { isExtAudio, isExtImage } from '@shared/src/types';
import { pick } from '@shared/src/utils';
import { computed, defineAsyncComponent } from 'vue';

const props = defineProps<{
  fileUrl: string;
}>();

const LazyAttachmentWithUnknownExtension = defineAsyncComponent(() => import('./AttachmentWithUnknownExtension.vue'));

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
        is: LazyAttachmentWithUnknownExtension,
        binds: pick(props, ['fileUrl']),
      };
  }
});
</script>

<style lang="scss" module="$s">
.postDataAttachment {
  max-width: 100%;
}
</style>

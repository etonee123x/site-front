<template>
  <component :is="component.is" class="max-w-full" v-bind="component.binds" />
</template>

<script setup lang="ts">
import { isExtAudio, isExtImage, isExtVideo } from '@shared/src/types';
import { pick } from '@shared/src/utils';
import { computed, defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';

import { getFileUrlExt, getLastParameter } from '@/utils/url';
import { useGalleryStore } from '@/stores/gallery';
import { useBlogStore } from '@/stores/blog';

const LazyAttachmentWithUnknownExtension = defineAsyncComponent(() => import('./AttachmentWithUnknownExtension.vue'));

const props = defineProps<{
  fileUrl: string;
}>();

const { loadGalleryItem } = useGalleryStore();

const blogStore = useBlogStore();
const { posts } = storeToRefs(blogStore);

const loadToGallery = () => {
  const maybeLastParameter = getLastParameter(props.fileUrl);
  if (!maybeLastParameter) {
    return;
  }

  loadGalleryItem(
    { name: maybeLastParameter, src: props.fileUrl },
    posts.value.reduce<NonNullable<Parameters<typeof loadGalleryItem>[1]>>(
      (acc, post) => [
        ...acc,
        ...post.filesUrls.reduce<NonNullable<Parameters<typeof loadGalleryItem>[1]>>((acc, fileUrl) => {
          const maybeExt = getFileUrlExt(fileUrl);

          if (!(maybeExt && (isExtImage(maybeExt) || isExtVideo(maybeExt)))) {
            return acc;
          }

          const maybeLastParameter = getLastParameter(fileUrl);
          if (!maybeLastParameter) {
            return acc;
          }

          return [...acc, { name: maybeLastParameter, src: fileUrl }];
        }, []),
      ],
      [],
    ),
  );
};

const component = computed(() => {
  const maybeExt = getFileUrlExt(props.fileUrl);

  switch (true) {
    case maybeExt && isExtImage(maybeExt):
      return {
        is: 'img',
        binds: {
          src: props.fileUrl,
          onClick: (e: Event) => {
            e.stopPropagation();
            loadToGallery();
          },
        },
      };
    case maybeExt && isExtAudio(maybeExt):
      return {
        is: 'audio',
        binds: {
          src: props.fileUrl,
          controls: true,
        },
      };
    case maybeExt && isExtVideo(maybeExt):
      return {
        is: 'video',
        binds: {
          src: props.fileUrl,
          controls: true,
          onClick: (e: Event) => {
            e.stopPropagation();
            loadToGallery();
          },
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

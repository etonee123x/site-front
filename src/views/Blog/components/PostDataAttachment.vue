<template>
  <component :is="component.is" class="max-w-full" v-bind="component.binds" />
</template>

<script setup lang="ts">
import { isExtAudio, isExtImage, isExtVideo } from '@shared/src/types';
import { pick } from '@shared/src/utils';
import { computed, defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';

import { getLastParameter } from '@/utils/url';
import { useGalleryStore } from '@/stores/gallery';
import { useBlogStore } from '@/stores/blog';

const LazyAttachmentWithUnknownExtension = defineAsyncComponent(() => import('./AttachmentWithUnknownExtension.vue'));

const props = defineProps<{
  fileUrl: string;
}>();

const { loadGalleryItem } = useGalleryStore();

const blogStore = useBlogStore();
const { posts } = storeToRefs(blogStore);

const component = computed(() => {
  const ext = props.fileUrl.match(/\.[^.]*$/)?.[0] ?? '';

  switch (true) {
    case isExtImage(ext):
      return {
        is: 'img',
        binds: {
          src: props.fileUrl,
          onClick: (e: Event) => {
            e.stopPropagation();

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
                    const ext = fileUrl.match(/\.[^.]*$/)?.[0] ?? '';

                    if (!(isExtImage(ext) || isExtVideo(ext))) {
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
          },
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

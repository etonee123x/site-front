<template>
  <component :is="component.is" class="max-w-full" v-bind="component.binds" @click.stop.prevent />
</template>

<i18n lang="yaml">
Ru:
  attachmentN: 'Вложение { N }'
En:
  attachmentN: 'Attachment { N }'
</i18n>

<script setup lang="ts">
import { isExtAudio, isExtImage, isExtVideo } from '@etonee123x/shared/helpers/folderData';
import { pick } from '@etonee123x/shared/utils/pick';
import { computed, defineAsyncComponent } from 'vue';

import { getFileUrlExt, getLastParameter } from '@/utils/url';
import { useGalleryStore } from '@/stores/gallery';
import { useBlogStore } from '@/stores/blog';
import { useI18n } from 'vue-i18n';

const LazyAttachmentWithUnknownExtension = defineAsyncComponent(() => import('./AttachmentWithUnknownExtension.vue'));
const LazyPreviewVideo = defineAsyncComponent(() => import('@/components/PreviewVideo.vue'));

const props = defineProps<{
  fileUrl: string;
  index: number;
}>();

const { t } = useI18n({ useScope: 'local' });

const { loadGalleryItem } = useGalleryStore();

const blogStore = useBlogStore();

const loadToGallery = () => {
  const maybeLastParameter = getLastParameter(props.fileUrl);

  if (!maybeLastParameter) {
    return;
  }

  loadGalleryItem(
    { name: maybeLastParameter, src: props.fileUrl },
    blogStore.all.reduce<NonNullable<Parameters<typeof loadGalleryItem>[1]>>(
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
          alt: t('attachmentN', { N: props.index + 1 }),
          onClick: loadToGallery,
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
        is: LazyPreviewVideo,
        binds: {
          src: props.fileUrl,
          onClick: loadToGallery,
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

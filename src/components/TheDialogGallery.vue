<template>
  <BaseDialog isHiddenFooter isHiddenHeader v-model="isDialogOpen" @close="onClose">
    <article v-if="galleryStore.galleryItem" class="flex flex-col gap-2 items-center flex-1 w-full h-full">
      <header class="contents">
        <BaseAlwaysScrollable class="w-full [--base-always-scrollable--content--margin:0_auto]" duration="12000">
          {{ galleryStore.galleryItem.name }}
        </BaseAlwaysScrollable>
      </header>
      <div class="flex-1 flex items-center justify-center overflow-hidden w-full h-full" ref="mediaContainer">
        <component
          :is="component.is"
          v-bind="component.binds"
          class="object-contain border-none max-w-full max-h-[calc(90dvh_-2*4*var(--spacing)_-6*var(--spacing)_-2*var(--spacing))]"
          :src="galleryStore.galleryItem.src"
        />
      </div>
    </article>
  </BaseDialog>
</template>

<script lang="ts" setup>
import { onKeyStroke, useSwipe, useToggle } from '@vueuse/core';
import { computed, useTemplateRef, watchEffect } from 'vue';

import BaseAlwaysScrollable from '@/components/ui/BaseAlwaysScrollable.vue';
import BaseDialog from '@/components/ui/BaseDialog.vue';
import { useGalleryStore } from '@/stores/gallery';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const galleryStore = useGalleryStore();

onKeyStroke('ArrowRight', () => galleryStore.next());
onKeyStroke('ArrowLeft', () => galleryStore.prev());

const mediaContainer = useTemplateRef('mediaContainer');

const component = computed(() =>
  galleryStore.isCurrentGalleryItemVideo
    ? {
        is: 'video',
        binds: {
          controls: true,
        },
      }
    : {
        is: 'img',
      },
);

useSwipe(mediaContainer, {
  onSwipeEnd: (...[, direction]) => {
    if (direction === 'right') {
      return galleryStore.prev();
    }

    if (direction === 'left') {
      return galleryStore.next();
    }
  },
});

const onClose = () => {
  galleryStore.unloadGalleryItem();

  router.push(route.fullPath.split('/').slice(0, -1).join('/'));
};

const [isDialogOpen, toggleIsDialogOpen] = useToggle(Boolean(galleryStore.isGalleryItemLoaded));

watchEffect(() => toggleIsDialogOpen(Boolean(galleryStore.isGalleryItemLoaded)));
</script>

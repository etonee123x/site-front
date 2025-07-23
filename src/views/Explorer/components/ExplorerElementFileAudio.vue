<template>
  <ElementFileWrapper :element @keydown.enter="onClick" @click="onClick">
    <div class="flex gap-4 overflow-x-auto">
      <div
        v-for="metadata in metadataList"
        :title="metadata.title"
        class="flex flex-col items-center"
        :key="metadata.id"
      >
        <BaseIcon class="text-2xl h-6" :path="metadata.path" />
        <div class="text-center max-w-40">
          {{ metadata.value }}
        </div>
      </div>
    </div>
  </ElementFileWrapper>
</template>

<i18n lang="yaml">
En:
  duration: 'Duration'
  artists: 'Artist(-s)'
  album: 'Album'
  year: 'Release year'
  bpm: 'BPM'
Ru:
  duration: 'Длительность'
  artists: 'Исполнитель(-и)'
  album: 'Альбом'
  year: 'Год выхода'
  bpm: 'Темп'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import type { ItemAudio } from '@etonee123x/shared/helpers/folderData';
import { mdiClockOutline, mdiAccountOutline, mdiAlbum, mdiCalendarBlankOutline, mdiMetronome } from '@mdi/js';

import ElementFileWrapper from './_ElementFileWrapper.vue';

import { formatDuration } from '@/utils/formatDuration';
import { usePlayerStore } from '@/stores/player';
import BaseIcon from '@/components/ui/BaseIcon';
import type { WithSinceBirthtime } from '@/api/folderData';

const props = defineProps<{
  element: ItemAudio & WithSinceBirthtime;
}>();

const playerStore = usePlayerStore();

const { t } = useI18n({ useScope: 'local' });

const onClick = () => playerStore.loadTrack(props.element);

const metadataList = computed(() => [
  {
    id: 0,
    title: t('duration'),
    path: mdiClockOutline,
    value: formatDuration(props.element.metadata.duration * 1000),
  },
  ...(props.element.metadata.artists.length
    ? [
        {
          id: 1,
          title: t('artists'),
          path: mdiAccountOutline,
          value: props.element.metadata.artists.join(' & '),
        },
      ]
    : []),
  ...(props.element.metadata.album
    ? [
        {
          id: 2,
          title: t('album'),
          path: mdiAlbum,
          value: props.element.metadata.album,
        },
      ]
    : []),
  ...(props.element.metadata.year
    ? [
        {
          id: 3,
          title: t('year'),
          path: mdiCalendarBlankOutline,
          value: String(props.element.metadata.year),
        },
      ]
    : []),
  ...(props.element.metadata.bpm
    ? [
        {
          id: 4,
          title: t('bpm'),
          path: mdiMetronome,
          value: String(props.element.metadata.bpm),
        },
      ]
    : []),
]);
</script>

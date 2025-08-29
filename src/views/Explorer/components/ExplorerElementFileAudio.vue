<template>
  <ElementFileWrapper :element>
    <ul class="flex gap-4 overflow-x-auto">
      <li
        v-for="metadataItem in metadataItems"
        :title="metadataItem.title"
        class="flex flex-col items-center"
        :key="metadataItem.key"
      >
        <BaseIcon class="text-2xl h-6" :path="metadataItem.path" />
        <span class="text-center max-w-40">
          {{ metadataItem.value }}
        </span>
      </li>
    </ul>
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

import { millisecondsToHumanReadable } from '@/utils/millisecondsToHumanReadable';
import BaseIcon from '@/components/ui/BaseIcon';
import type { ItemWithSinceTimestamps } from '@/api/folderData';

const props = defineProps<{
  element: ItemWithSinceTimestamps<ItemAudio>;
}>();

const { t } = useI18n({ useScope: 'local' });

const metadataItems = computed(() => [
  ...(props.element.musicMetadata.duration
    ? [
        {
          key: 'duration',
          title: t('duration'),
          path: mdiClockOutline,
          value: millisecondsToHumanReadable(props.element.musicMetadata.duration),
        },
      ]
    : []),
  ...(props.element.musicMetadata.artists?.length
    ? [
        {
          key: 'artists',
          title: t('artists'),
          path: mdiAccountOutline,
          value: props.element.musicMetadata.artists.join(' & '),
        },
      ]
    : []),
  ...(props.element.musicMetadata.album
    ? [
        {
          key: 'album',
          title: t('album'),
          path: mdiAlbum,
          value: props.element.musicMetadata.album,
        },
      ]
    : []),
  ...(props.element.musicMetadata.year
    ? [
        {
          key: 'year',
          title: t('year'),
          path: mdiCalendarBlankOutline,
          value: String(props.element.musicMetadata.year),
        },
      ]
    : []),
  ...(props.element.musicMetadata.bpm
    ? [
        {
          key: 'bpm',
          title: t('bpm'),
          path: mdiMetronome,
          value: String(props.element.musicMetadata.bpm),
        },
      ]
    : []),
]);
</script>

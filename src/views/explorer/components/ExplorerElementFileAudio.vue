<template>
  <ElementFileWrapper :element="element" @keydown.enter="onClick" @click="onClick">
    <div :class="$style.metadataList">
      <div v-for="metadata in metadataList" :key="metadata.id" :title="metadata.title" :class="$style.metadata">
        <BaseIcon class="text-2xl" :class="$style.metadataIcon" :path="metadata.path" />
        <div :class="$style.metadataValue">
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
import { ItemAudio } from '@shared/src/types';
import { isNotEmptyArray, isTruthy } from '@shared/src/utils';
import { mdiClockOutline, mdiAccountOutline, mdiAlbum, mdiCalendarBlankOutline, mdiMetronome } from '@mdi/js';

import ElementFileWrapper from './_ElementFileWrapper.vue';

import { formatDuration, addId } from '@/utils';
import { usePlayerStore } from '@/stores/player';
import BaseIcon from '@/components/ui/BaseIcon.vue';

const props = defineProps<{
  element: ItemAudio;
}>();

const playerStore = usePlayerStore();

const { t } = useI18n({ useScope: 'local' });

const onClick = () => playerStore.loadTrack(props.element);

const metadataList = computed(() =>
  [
    {
      title: t('duration'),
      path: mdiClockOutline,
      value: formatDuration(props.element.metadata.duration * 1000),
    },
    isNotEmptyArray(props.element.metadata.artists) && {
      title: t('artists'),
      path: mdiAccountOutline,
      value: props.element.metadata.artists.join(' & '),
    },
    props.element.metadata.album && {
      title: t('album'),
      path: mdiAlbum,
      value: props.element.metadata.album,
    },
    props.element.metadata.year && {
      title: t('year'),
      path: mdiCalendarBlankOutline,
      value: String(props.element.metadata.year),
    },
    props.element.metadata.bpm && {
      title: t('bpm'),
      path: mdiMetronome,
      value: String(props.element.metadata.bpm),
    },
  ]
    .filter(isTruthy)
    .map(addId),
);
</script>

<style module lang="scss">
.metadataList {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
}

.metadata {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metadataIcon {
  height: 1.5rem;
}

.metadataValue {
  text-align: center;
  max-width: 10rem;
}
</style>

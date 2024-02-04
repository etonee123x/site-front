<template>
  <ElementFile :element="element" @click="onClick">
    <div :class="$style.metadataList">
      <div v-for="metadata in metadataList" :key="metadata.id" :class="$style.metadata" :title="metadata.title">
        <img :class="$style.metadataIcon" :alt="metadata.title" :src="metadata.iconSrc" />
        <div :class="$style.metadataValue">
          {{ metadata.value }}
        </div>
      </div>
    </div>
  </ElementFile>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isNotEmptyArray, isTruthy, ItemAudio } from '@types';

import { formatDuration, addId } from '@/utils';
import { usePlayerStore } from '@/stores/player';
import ElementFile from '@/views/explorer/components/ElementFile';

const props = defineProps<{
  element: ItemAudio;
}>();

const playerStore = usePlayerStore();

const onClick = () => playerStore.loadTrack(props.element);

const metadataList = computed(() =>
  [
    {
      title: 'Duration',
      iconSrc: 'https://img.icons8.com/material-outlined/48/000000/clock--v1.png',
      value: formatDuration(props.element.metadata.duration * 1000),
    },
    isNotEmptyArray(props.element.metadata.artists) && {
      title: 'Artist(-s)',
      iconSrc: 'https://img.icons8.com/material-outlined/48/000000/user--v1.png',
      value: props.element.metadata.artists.join(' & '),
    },
    props.element.metadata.album && {
      title: 'Album',
      iconSrc: 'https://img.icons8.com/ios-glyphs/60/000000/music-record.png',
      value: props.element.metadata.album,
    },
    props.element.metadata.year && {
      title: 'Release year',
      iconSrc: 'https://img.icons8.com/material-outlined/48/000000/calendar--v1.png',
      value: String(props.element.metadata.year),
    },
    props.element.metadata.bpm && {
      title: 'BPM',
      iconSrc: 'https://img.icons8.com/ios/60/000000/metronome.png',
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

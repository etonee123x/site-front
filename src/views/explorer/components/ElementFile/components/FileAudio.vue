<template>
  <ElementFile :element="element" @click="onClick">
    <div :class="$style.metadataList">
      <div v-for="metadata in metadataList" :key="metadata.id" :title="metadata.title" :class="$style.metadata">
        <BaseIcon :class="$style.metadataIcon" :path="metadata.path" />
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
import { mdiClockOutline, mdiAccountOutline, mdiAlbum, mdiCalendarBlankOutline, mdiMetronome } from '@mdi/js';

import { formatDuration, addId } from '@/utils';
import { usePlayerStore } from '@/stores/player';
import ElementFile from '@/views/explorer/components/ElementFile';
import BaseIcon from '@/components/BaseIcon.vue';

const props = defineProps<{
  element: ItemAudio;
}>();

const playerStore = usePlayerStore();

const onClick = () => playerStore.loadTrack(props.element);

const metadataList = computed(() =>
  [
    {
      title: 'Duration',
      path: mdiClockOutline,
      value: formatDuration(props.element.metadata.duration * 1000),
    },
    isNotEmptyArray(props.element.metadata.artists) && {
      title: 'Artist(-s)',
      path: mdiAccountOutline,
      value: props.element.metadata.artists.join(' & '),
    },
    props.element.metadata.album && {
      title: 'Album',
      path: mdiAlbum,
      value: props.element.metadata.album,
    },
    props.element.metadata.year && {
      title: 'Release year',
      path: mdiCalendarBlankOutline,
      value: String(props.element.metadata.year),
    },
    props.element.metadata.bpm && {
      title: 'BPM',
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

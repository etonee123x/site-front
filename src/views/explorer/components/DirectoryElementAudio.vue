<template>
  <div @click="onClick">
    <div class="directory-element directory-element_file">
      <div class="directory-element__header">
        <div class="directory-element__title">
          {{ element.name }}
        </div>
        <div
          class="directory-element__birth-time"
          title="Created at"
        >
          {{ getFormattedBirthTime(element.birthtime) }}
        </div>
      </div>
      <div class="directory-element__content">
        <div class="item__metadata metadata">
          <div
            class="metadata__item"
            title="Duration"
          >
            <img
              class="metadata__icon"
              alt="duration"
              src="https://img.icons8.com/material-outlined/48/000000/clock--v1.png"
            >
            <div class="metadata__value">
              {{ formatDuration(element.metadata.duration) }}
            </div>
          </div>
          <div
            v-if="element.metadata.artists"
            class="metadata__item"
            title="Artist(-s)"
          >
            <img
              class="metadata__icon"
              alt="artist(-s)"
              src="https://img.icons8.com/material-outlined/48/000000/user--v1.png"
            >
            <div class="metadata__value">
              {{ element.metadata.artists.join(' & ') }}
            </div>
          </div>
          <div
            v-if="element.metadata.album"
            class="metadata__item"
            title="Album"
          >
            <img
              class="metadata__icon"
              alt="album"
              src="https://img.icons8.com/ios-glyphs/60/000000/music-record.png"
            >
            <div class="metadata__value">
              {{ element.metadata.album }}
            </div>
          </div>
          <div
            v-if="element.metadata.year"
            class="metadata__item"
            title="Release year"
          >
            <img
              class="metadata__icon"
              alt="release year"
              src="https://img.icons8.com/material-outlined/48/000000/calendar--v1.png"
            >
            <div class="metadata__value">
              {{ element.metadata.year }}
            </div>
          </div>
          <div
            v-if="element.metadata.bpm"
            class="metadata__item"
            title="BPM"
          >
            <img
              class="metadata__icon"
              alt="bpm"
              src="https://img.icons8.com/ios/60/000000/metronome.png"
            >
            <div class="metadata__value">
              {{ element.metadata.bpm }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AudioItem } from '@types';
import { getFormattedBirthTime, formatDuration } from '@/utils';
import { usePlayerStore } from '@/stores/player';

const props = defineProps<{ element: AudioItem }>();

const playerStore = usePlayerStore();

const onClick = () => playerStore.loadTrack(props.element);
</script>

<style scoped lang="scss">
@import '../assets/styles/directory-element.scss';
.metadata {
  display: flex;
  gap: 1rem;
  overflow-x: auto;

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__icon {
    height: 1.5rem;
  }

  &__value {
    text-align: center;
    max-width: 10rem;
  }
}
</style>

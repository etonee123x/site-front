<template>
  <router-link :to="element.url">
    <div class="directory-element directory-element_file">
      <div class="directory-element__header">
        <div class="directory-element__title">
          <slot>{{ element.name }}</slot>
        </div>
        <div class="directory-element__birth-time" title="Created at">
          {{ getFormattedBirthTime(element.birthTime) }}
        </div>
      </div>
      <div class="directory-element__content">
        <div class="item__metadata metadata">
          <div class="metadata__item" title="Duration">
            <img
              class="metadata__icon"
              alt="duration"
              src="https://img.icons8.com/material-outlined/48/000000/clock--v1.png"
            />
            <div class="metadata__value">{{ formatDuration(element.metadata.duration) }}</div>
          </div>
          <div v-if="element.metadata.artists" class="metadata__item" title="Artist(-s)">
            <img
              class="metadata__icon"
              alt="artist(-s)"
              src="https://img.icons8.com/material-outlined/48/000000/user--v1.png"
            />
            <div class="metadata__value">{{ element.metadata.artists.join(' & ') }}</div>
          </div>
          <div v-if="element.metadata.album" class="metadata__item" title="Album">
            <img
              class="metadata__icon"
              alt="album"
              src="https://img.icons8.com/ios-glyphs/60/000000/music-record.png"
            />
            <div class="metadata__value">{{ element.metadata.album }}</div>
          </div>
          <div v-if="element.metadata.year" class="metadata__item" title="Release year">
            <img
              class="metadata__icon"
              alt="release year"
              src="https://img.icons8.com/material-outlined/48/000000/calendar--v1.png"
            />
            <div class="metadata__value">{{ element.metadata.year }}</div>
          </div>
          <div v-if="element.metadata.bpm" class="metadata__item" title="BPM">
            <img class="metadata__icon" alt="bpm" src="https://img.icons8.com/ios/60/000000/metronome.png" />
            <div class="metadata__value">{{ parseFloat(Number(element.metadata.bpm).toFixed(2)) }}</div>
          </div>
          <div v-if="element.metadata.bitrate" class="metadata__item" title="Bitrate">
            <img class="metadata__icon" alt="bitrate" src="https://img.icons8.com/ios/50/000000/bit-rate.png" />
            <div class="metadata__value">{{ element.metadata.bitrate / 1000 }}</div>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { ItemAudio } from '@types';
import { getFormattedBirthTime, formatDuration } from '@/utils';

defineProps<{ element: ItemAudio }>();
</script>

<style scoped lang="scss">
.metadata {
  display: flex;
  flex-direction: row;
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

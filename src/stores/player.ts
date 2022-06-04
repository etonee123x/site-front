import { LinkedFile } from '@types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const usePlayerStore = defineStore('player', () => {
  const theTrack = ref<LinkedFile | null>(null);

  const isTrackExists = computed(() => Boolean(theTrack.value));

  const loadTrack = (track: LinkedFile) => {
    theTrack.value = track;
  };

  return { loadTrack, isTrackExists, theTrack };
});

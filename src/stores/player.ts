import { AudioItem } from '@types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

let realPlaylistHref = window.location.href;
let currentPlayingNumber = 0;

let potentialPlaylist: AudioItem[] = [];
let realPlaylist: AudioItem[] = [];

export const usePlayerStore = defineStore('player', () => {
  const theTrack = ref<AudioItem | null>(null);

  const isTrackLoaded = computed(() => Boolean(theTrack.value));

  const loadTrack = (track: AudioItem) => {
    if (window.location.href !== realPlaylistHref || !theTrack.value) {
      realPlaylist = potentialPlaylist;
      realPlaylistHref = window.location.href;
    }
    theTrack.value = track;
    currentPlayingNumber = realPlaylist.findIndex(({ name }) => name === theTrack.value?.name);
  };

  const loadRealPlaylist = (playlist: AudioItem[]) => {
    realPlaylistHref = window.location.href;
    realPlaylist = playlist;
  };

  const loadPotentialPlaylist = (playlist: AudioItem[]) => {
    potentialPlaylist = playlist;
  };

  const loadNext = () => {
    currentPlayingNumber = (currentPlayingNumber + 1) % realPlaylist.length;
    theTrack.value = realPlaylist[currentPlayingNumber];
  };

  const loadPrev = () => {
    currentPlayingNumber = (currentPlayingNumber - 1 + realPlaylist.length) % realPlaylist.length;
    theTrack.value = realPlaylist[currentPlayingNumber];
  };

  return {
    theTrack,
    isTrackLoaded,
    loadTrack,
    loadRealPlaylist,
    loadPotentialPlaylist,
    loadPrev,
    loadNext,
  };
});

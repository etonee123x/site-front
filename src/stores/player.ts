import { LinkedFile, PlaylistItem } from '@types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const usePlayerStore = defineStore('player', () => {
  const theTrack = ref<LinkedFile | null>(null);
  const thePlaylist = ref<PlaylistItem[]>([]);
  const currentPlayingNumber = ref<number>(0);

  const isTrackExists = computed(() => Boolean(theTrack.value));

  const loadTrack = (track: LinkedFile) => {
    theTrack.value = track;
  };

  const loadPlaylist = (playlist: PlaylistItem[]) => {
    thePlaylist.value = playlist;
    playlist.forEach((playlistItem, idx) => {
      if (playlistItem.thisIsLinkedFile) currentPlayingNumber.value = idx;
    });
  };

  const loadNext = () => {
    if (currentPlayingNumber.value === thePlaylist.value.length - 1) return;
    currentPlayingNumber.value = (currentPlayingNumber.value + 1 + thePlaylist.value.length) % thePlaylist.value.length;
    theTrack.value = thePlaylist.value[currentPlayingNumber.value];
  };

  const loadPrev = () => {
    currentPlayingNumber.value = (currentPlayingNumber.value - 1 + thePlaylist.value.length) % thePlaylist.value.length;
    theTrack.value = thePlaylist.value[currentPlayingNumber.value];
  };

  return { loadTrack, loadPlaylist, loadPrev, loadNext, isTrackExists, theTrack };
});

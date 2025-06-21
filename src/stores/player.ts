import type { ItemAudio } from '@etonee123x/shared/helpers/folderData';
import { defineStore } from 'pinia';
import { computed, ref, shallowRef } from 'vue';

import { getRandomExceptCurrentIndex } from '@/utils/getRandomExceptCurrentIndex';

export const usePlayerStore = defineStore('player', () => {
  const theTrack = shallowRef<ItemAudio | null>(null);

  const currentPlayingNumber = ref(0);

  const playlistReal = ref<Array<ItemAudio>>([]);
  const playlistPotential = ref<Array<ItemAudio>>([]);

  const playlistRealHref = ref(window.location.href);

  const isTrackLoaded = computed(() => Boolean(theTrack.value));

  const historyItems = ref<Array<number>>([]);

  const isNotEmptyHistory = computed(() => Boolean(historyItems.value.length));

  const isShuffleModeEnabled = ref(false);

  const url = computed(() => theTrack.value?.url);
  const src = computed(() => theTrack.value?.src);
  const name = computed(() => theTrack.value?.name);

  const loadTrack = (track: ItemAudio) => {
    if (window.location.href !== playlistRealHref.value || !theTrack.value) {
      playlistReal.value = playlistPotential.value;
      playlistRealHref.value = window.location.href;
      historyItems.value = [];
    }

    theTrack.value = track;
    currentPlayingNumber.value = playlistReal.value.findIndex(({ name }) => name === theTrack.value?.name);
  };

  const unloadTrack = () => {
    theTrack.value = null;
  };

  const loadRealPlaylist = (playlist: ItemAudio[]) => {
    playlistReal.value = playlist;
    playlistRealHref.value = window.location.href;
  };

  const loadPotentialPlaylist = (playlist: ItemAudio[]) => {
    playlistPotential.value = playlist;
  };

  const loadNext = () => {
    historyItems.value.push(currentPlayingNumber.value);

    currentPlayingNumber.value = isShuffleModeEnabled.value
      ? getRandomExceptCurrentIndex(playlistReal.value.length, currentPlayingNumber.value)
      : (currentPlayingNumber.value + 1) % playlistReal.value.length;

    theTrack.value = playlistReal.value[currentPlayingNumber.value] ?? null;
  };

  const loadPrev = () => {
    currentPlayingNumber.value = isNotEmptyHistory.value
      ? (historyItems.value.pop() ?? 0)
      : (currentPlayingNumber.value - 1 + playlistReal.value.length) % playlistReal.value.length;

    theTrack.value = playlistReal.value[currentPlayingNumber.value] ?? null;
  };

  return {
    theTrack,
    isTrackLoaded,
    isShuffleModeEnabled,
    isNotEmptyHistory,
    url,
    src,
    name,

    loadTrack,
    unloadTrack,
    loadRealPlaylist,
    loadPotentialPlaylist,
    loadPrev,
    loadNext,
  };
});

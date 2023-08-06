<template>
  <div id="the-player" ref="thePlayer" class="player">
    <div class="player__container l-container">
      <div class="player__track-title">
        {{ theTrack?.name }}
      </div>
      <audio
        id="big-player-audio"
        ref="audio"
        :src="theTrack?.src"
        autoplay
        @ended="loadNext"
      />
      <div class="timeline">
        <div class="timeline__time-passed">
          {{ formattedCurrentTime }}
        </div>
        <div ref="timelineControl" class="timeline__zone-wrapper">
          <div class="timeline__zone">
            <div class="timeline__filler" :style="`width: ${timelineFillerWidth}%`" />
          </div>
        </div>
        <div class="timeline__duration">
          {{ formatedDuration }}
        </div>
      </div>
      <div class="controls-buttons">
        <div class="controls-buttons__left">
          <BaseButton class="controls-buttons__btn" @click="onCopyLinkClick">
            <BaseIcon size="20" :path="mdiLinkVariant" />
          </BaseButton>
        </div>
        <div class="controls-buttons__center">
          <BaseButton class="controls-buttons__btn controls-buttons__btn_main" @click="loadPrev">
            <BaseIcon :path="mdiSkipBackward" />
          </BaseButton>
          <BaseButton class="controls-buttons__btn controls-buttons__btn_main" @click="onPlayPauseClick">
            <BaseIcon :path="playPauseIcon" />
          </BaseButton>
          <BaseButton class="controls-buttons__btn controls-buttons__btn_main" @click="loadNext">
            <BaseIcon :path="mdiSkipForward" />
          </BaseButton>
        </div>
        <div class="controls-buttons__right">
          <div ref="volumeControl" class="controls-buttons__volume">
            <div class="controls-buttons__volume-zone-wrapper">
              <div class="controls-buttons__volume-zone">
                <div class="controls-buttons__volume-filler" :style="`width: ${(volume * 100).toFixed(2)}%`" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMediaControls, useMousePressed, useMouseInElement, useElementSize } from '@vueuse/core';
import { mdiLinkVariant, mdiPause, mdiPlay, mdiSkipBackward, mdiSkipForward } from '@mdi/js';
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';

import { usePlayerStore } from '@/stores/player';
import { formatDuration, to0To1Borders, createURL } from '@/utils';
import { useToastsStore } from '@/stores/toasts';

import BaseButton from '@/components/BaseButton.vue';
import BaseIcon from '@/components/BaseIcon.vue';

const thePlayer = ref<HTMLDivElement | null>(null);

const { height } = useElementSize(thePlayer, undefined, { box: 'border-box' });

watch(
  height,
  v => {
    document.documentElement.style.setProperty('--size-player-height', `${v}px`);
  },
);

const playerStore = usePlayerStore();
const { loadPrev, loadNext } = playerStore;
const { theTrack } = storeToRefs(playerStore);
const { toastSuccess } = useToastsStore();

const audio = ref<HTMLAudioElement>();
const timelineControl = ref<HTMLElement>();
const volumeControl = ref<HTMLElement>();

const position = ref<number>(0);
const isUsingPosition = ref<boolean>(false);

const { playing, currentTime, duration, volume } = useMediaControls(audio);
const { elementWidth: timelineControlWidth, elementX: timelineControlX } = useMouseInElement(timelineControl);
const { elementWidth: volumeControlWidth, elementX: volumeControlX } = useMouseInElement(volumeControl);
const timelineChanging = useMousePressed({ target: timelineControl });
const volumeChanging = useMousePressed({ target: volumeControl });

const timelineFillerWidth = computed(() =>
  duration.value
    ? (((isUsingPosition.value ? position.value : currentTime.value) * 100) / duration.value).toFixed(2)
    : 0,
);
const formatedDuration = computed(() => formatDuration(duration.value));
const formattedCurrentTime = computed(() => formatDuration(currentTime.value));
const playPauseIcon = computed(() => (playing.value ? mdiPause : mdiPlay));

watch(timelineChanging.pressed, async () => {
  if (!timelineChanging.pressed.value) {
    isUsingPosition.value = false;
    return;
  }

  isUsingPosition.value = true;
  while (timelineChanging.pressed.value) {
    await new Promise<void>(resolve =>
      setTimeout(() => {
        position.value = to0To1Borders(timelineControlX.value, timelineControlWidth.value) * duration.value;
        resolve();
      }, 0),
    );
  }
  currentTime.value = position.value;
});

watch(volumeChanging.pressed, async () => {
  while (volumeChanging.pressed.value) {
    await new Promise<void>(resolve =>
      setTimeout(() => {
        volume.value = to0To1Borders(volumeControlX.value, volumeControlWidth.value);
        resolve();
      }, 0),
    );
  }
});

const onPlayPauseClick = () => {
  playing.value = !playing.value;
};

const onCopyLinkClick = async () => {
  if (!theTrack.value) {
    return;
  }

  let url = createURL(window.location.origin, theTrack.value.url);
  try {
    url = decodeURI(url);
  } catch (e) {
    console.error(e);
  }
  await window.navigator.clipboard?.writeText(url);
  toastSuccess('Copied!');
};
</script>

<style lang="scss" scoped>
.player {
  background-color: var(--color-bg);
  z-index: var(--z-index-the-player);
  box-shadow: 0px -2px 4px 0px rgba(34, 60, 80, 0.2);
  padding: 0.5rem 0;

  &__container {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__track-title {
    text-align: center;
  }
}
.controls-buttons {
  display: grid;
  grid-template-areas: 'left center right';
  grid-template-columns: 1fr min-content 1fr;
  grid-column-gap: 1rem;
  align-items: center;

  &__center {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
  }

  &__right {
    display: flex;
  }

  &__left {
    display: flex;
    justify-content: end;
  }

  &__volume {
    display: none;
    height: 100%;
    width: 85%;
    max-width: 5rem;
    display: flex;
    align-items: center;
  }

  &__btn {
    white-space: nowrap;
    min-width: 1.5rem;

    &_main {
      height: 1.5rem;
      width: 2rem;
    }
  }

  &__volume-zone-wrapper {
    width: 100%;
    padding: 0.25rem 0;
    cursor: pointer;
  }

  &__volume-zone {
    background-color: var(--color-dark);
  }

  &__volume-filler {
    height: 0.25rem;
    background-color: var(--color-details);
  }
}
.timeline {
  height: 1.25rem;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;

  &__zone-wrapper {
    margin: auto;
    width: 100%;
    padding: 0.25rem 0;
    cursor: pointer;
  }

  &__zone {
    background-color: var(--color-dark);
  }

  &__filler {
    height: 0.25rem;
    background-color: var(--color-details);
  }
}
</style>

<template>
  <div v-if="playerStore.theTrack" class="player">
    <div class="player__track-title">{{ playerStore.theTrack.name }}</div>
    <audio id="big-player-audio" ref="audio" :src="playerStore.theTrack.src" autoplay @ended="onEnded" />
    <div class="timeline">
      <div class="timeline__time-passed">{{ formatDuration(currentTime) }}</div>
      <div ref="timelineControl" class="timeline__zone-wrapper">
        <div id="timeline-controls" class="timeline__zone">
          <div
            v-if="duration"
            class="timeline__filler"
            :style="`width: ${(((isUsingPosition ? position : currentTime) * 100) / duration).toFixed(2)}%`"
          ></div>
          <div v-else class="timeline__filler" style="width: 0%" />
        </div>
      </div>
      <div class="timeline__duration">{{ formatDuration(duration) }}</div>
    </div>
    <div class="controls-buttons">
      <div class="controls-buttons__left" />
      <div class="controls-buttons__center">
        <div class="controls-buttons__btn" @click="clickOnPrev">{{ '|<<' }}</div>
        <div class="controls-buttons__btn" @click="clickOnPlayPause">{{ playPauseIcon }}</div>
        <div class="controls-buttons__btn" @click="clickOnNext">
          {{ '>>|' }}
        </div>
      </div>
      <div class="controls-buttons__right">
        <div ref="volumeControl" class="controls-buttons__volume">
          <div class="controls-buttons__volume-zone-wrapper">
            <div id="volume-controls" class="controls-buttons__volume-zone">
              <div class="controls-buttons__volume-filler" :style="`width: ${(volume * 100).toFixed(2)}%`" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useMediaControls, useMousePressed, useMouseInElement } from '@vueuse/core';
import { formatDuration, to0To1Borders } from '@/utils';

const audio = ref<HTMLAudioElement | null>(null);
const timelineControl = ref<HTMLElement | null>(null);
const volumeControl = ref<HTMLElement | null>(null);

const playerStore = usePlayerStore();

const playPauseIcon = computed(() => (playing.value ? '| |' : '|>'));

const position = ref<number>(0);
const isUsingPosition = ref<boolean>(false);

const { playing, currentTime, duration, volume } = useMediaControls(audio);
const { elementWidth: timelineControlWidth, elementX: timelineControlX } = useMouseInElement(timelineControl);
const { elementWidth: volumeControlWidth, elementX: volumeControlX } = useMouseInElement(volumeControl);
const volumeChanging = useMousePressed({ target: volumeControl });
const timelineChanging = useMousePressed({ target: timelineControl });

watch(timelineChanging.pressed, async () => {
  if (!timelineChanging.pressed.value) {
    isUsingPosition.value = false;
    return;
  }
  isUsingPosition.value = true;
  while (timelineChanging.pressed.value) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    position.value = to0To1Borders(timelineControlX.value, timelineControlWidth.value) * duration.value;
  }
  currentTime.value = position.value;
});

watch(volumeChanging.pressed, async () => {
  while (volumeChanging.pressed.value) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    volume.value = to0To1Borders(volumeControlX.value, volumeControlWidth.value);
  }
});

const clickOnPrev = () => {
  console.log('clickOnPrev');
  playerStore.loadPrev();
};

const clickOnPlayPause = () => {
  playing.value = !playing.value;
};

const clickOnNext = () => {
  console.log('clickOnNext');
  playerStore.loadNext();
};

const onEnded = () => {
  console.log('onEnded');
  playerStore.loadNext();
};
</script>

<style lang="scss" scoped>
.player {
  height: 8rem;
  background-color: $color-bg;
  z-index: $zindex-bigplayer;
  box-shadow: 0px -2px 4px 0px rgba(34, 60, 80, 0.2);
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  &__track-title {
    text-align: center;
  }
}
.controls-buttons {
  height: 100%;
  display: grid;
  grid-template-areas: 'left center right';
  grid-template-columns: 1fr min-content 1fr;
  grid-column-gap: 1rem;

  &__center {
    grid-area: center;
    display: flex;
    justify-content: center;
    gap: 0.25rem;
  }

  &__right {
    grid-area: right;
    height: 100%;
  }

  &__left {
    grid-area: left;
    height: 100%;
  }

  &__btn {
    cursor: pointer;
    border: 1px $color-dark solid;
    height: 1.75rem;
    width: 2rem;
    text-align: center;
    vertical-align: middle;
    line-height: 20px;

    svg {
      height: 100%;
    }
  }

  &__volume {
    @media (hover: none) {
      display: none;
    }
    height: 100%;
    width: 5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  &__volume-zone-wrapper {
    width: 100%;
    padding: 3px 0;
    cursor: pointer;
  }

  &__volume-zone {
    background-color: $color-dark;
  }

  &__volume-filler {
    height: 3px;
    background-color: $color-details;
  }
}
.timeline {
  height: 1.25rem;
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;

  &__zone-wrapper {
    margin: auto;
    width: 100%;
    padding: 3px 0;
    cursor: pointer;
  }

  &__zone {
    background-color: $color-dark;
  }

  &__filler {
    height: 3px;
    background-color: $color-details;
  }
}
</style>

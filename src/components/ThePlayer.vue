<template>
  <div v-if="theTrack" id="the-player" :class="$style.player">
    <BaseIcon v-if="!isPlaying" :class="$style.playerClose" :path="mdiClose" @click="onClickClose" />
    <div :class="[$style.container, 'l-container']">
      <div :class="$style.title">
        {{ theTrack.name }}
      </div>
      <audio ref="refAudio" :src="theTrack.src" autoplay @ended="onEnded" />
      <div :class="$style.timeline">
        <div>
          {{ formattedCurrentTime }}
        </div>
        <div ref="refTimelineControl" :class="$style.timelineZoneWrapper">
          <div :class="$style.timelineZone">
            <div :class="$style.timelineFiller" :style="`width: ${timelineFillerWidth}%`" />
          </div>
        </div>
        <div>
          {{ formatedDuration }}
        </div>
      </div>
      <div :class="$style.controls">
        <div :class="$style.controlsLeft">
          <BaseButton :class="$style.controlsButton" @click="onCopyLinkClick">
            <BaseIcon size="20" :path="mdiLinkVariant" />
          </BaseButton>
        </div>
        <div :class="$style.controlsCenter">
          <BaseButton
            v-for="controlButton in controlButtons"
            :key="controlButton.id"
            :class="[$style.controlsButton, $style.controlsButton_main]"
            @click="controlButton.onClick"
          >
            <BaseIcon :path="controlButton.icon" />
          </BaseButton>
        </div>
        <div :class="$style.controlsRight">
          <div ref="refVolumeControl" :class="$style.controlsVolume">
            <div :class="$style.controlsVolumeZoneWrapper">
              <div :class="$style.controlsVolumeZone">
                <div :class="$style.controlsVolumeFiller" :style="`width: ${(volume * 100).toFixed(2)}%`" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMediaControls, useMousePressed, useMouseInElement } from '@vueuse/core';
import { mdiClose, mdiLinkVariant, mdiPause, mdiPlay, mdiSkipBackward, mdiSkipForward } from '@mdi/js';
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';

import { usePlayerStore } from '@/stores/player';
import { formatDuration, to0To1Borders, addId } from '@/utils';
import { useToastsStore } from '@/stores/toasts';
import BaseButton from '@/components/BaseButton.vue';
import BaseIcon from '@/components/BaseIcon.vue';

const playerStore = usePlayerStore();
const { theTrack } = storeToRefs(playerStore);
const toastsStore = useToastsStore();

const refAudio = ref<HTMLAudioElement>();
const refTimelineControl = ref<HTMLElement>();
const refVolumeControl = ref<HTMLElement>();

const position = ref(0);
const isUsingPosition = ref(false);

const { playing: isPlaying, currentTime, duration, volume } = useMediaControls(refAudio);

const { elementWidth: timelineControlWidth, elementX: timelineControlX } = useMouseInElement(refTimelineControl);
const { elementWidth: volumeControlWidth, elementX: volumeControlX } = useMouseInElement(refVolumeControl);

const { pressed: isTimelinePressed } = useMousePressed({ target: refTimelineControl });
const { pressed: isVolumePressed } = useMousePressed({ target: refVolumeControl });

const controlButtons = computed(() =>
  [
    {
      icon: mdiSkipBackward,
      onClick: playerStore.loadPrev,
    },
    {
      icon: isPlaying.value ? mdiPause : mdiPlay,
      onClick: onClickPlayPause,
    },
    {
      icon: mdiSkipForward,
      onClick: playerStore.loadNext,
    },
  ].map(addId),
);

const timelineFillerWidth = computed(() =>
  duration.value
    ? (((isUsingPosition.value ? position.value : currentTime.value) * 100) / duration.value).toFixed(2)
    : 0,
);
const formatedDuration = computed(() => formatDuration(duration.value * 1000));
const formattedCurrentTime = computed(() => formatDuration(currentTime.value * 1000));

watch(isTimelinePressed, async () => {
  if (!isTimelinePressed.value) {
    isUsingPosition.value = false;
    return;
  }

  isUsingPosition.value = true;
  while (isTimelinePressed.value) {
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        position.value = to0To1Borders(timelineControlX.value, [, timelineControlWidth.value]) * duration.value;
        resolve();
      }, 0),
    );
  }
  currentTime.value = position.value;
});

watch(isVolumePressed, async () => {
  while (isVolumePressed.value) {
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        volume.value = to0To1Borders(volumeControlX.value, [, volumeControlWidth.value]);
        resolve();
      }, 0),
    );
  }
});

const onClickPlayPause = () => {
  isPlaying.value = !isPlaying.value;
};

const onCopyLinkClick = async () => {
  if (!theTrack.value) {
    return;
  }

  console.log(theTrack.value.url);

  let url = [window.location.origin, theTrack.value.url].join('');

  try {
    url = decodeURI(url);
  } catch (e) {
    console.error(e);
  }

  await window.navigator.clipboard?.writeText(url);

  toastsStore.toastSuccess('Copied!');
};

const onEnded = playerStore.loadNext;

const onClickClose = playerStore.unloadTrack;
</script>

<style lang="scss" module>
.player {
  background-color: var(--color-bg);
  z-index: var(--z-index-the-player);
  box-shadow: 0px -2px 4px 0px rgba(34, 60, 80, 0.2);
  padding: 0.5rem 0;
}

.playerClose {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  cursor: pointer;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.title {
  text-align: center;
}

.controls {
  display: grid;
  grid-template-areas: 'left center right';
  grid-template-columns: 1fr min-content 1fr;
  grid-column-gap: 1rem;
  align-items: center;
}

.controlsLeft {
  display: flex;
  justify-content: end;
}

.controlsCenter {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.controlsRight {
  display: flex;
}

.controlsButton {
  white-space: nowrap;
  min-width: 1.5rem;

  &_main {
    height: 1.5rem;
    width: 2rem;
  }
}

.controlsVolume {
  display: none;
  height: 100%;
  width: 85%;
  max-width: 5rem;
  display: flex;
  align-items: center;
}

.controlsVolumeZoneWrapper {
  width: 100%;
  padding: 0.25rem 0;
  cursor: pointer;
}

.controlsVolumeZone {
  background-color: var(--color-dark);
}

.controlsVolumeFiller {
  height: 0.25rem;
  background-color: var(--color-details);
}

.timeline {
  height: 1.25rem;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.timelineZoneWrapper {
  margin: auto;
  width: 100%;
  padding: 0.25rem 0;
  cursor: pointer;
}

.timelineZone {
  background-color: var(--color-dark);
}

.timelineFiller {
  height: 0.25rem;
  background-color: var(--color-details);
}
</style>

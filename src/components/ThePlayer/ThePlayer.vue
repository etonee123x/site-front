<template>
  <BaseSwipable v-if="theTrack" id="the-player" :class="$style.player" @swiped="onSwiped">
    <div :class="[$style.container, 'l-container']">
      <BaseIcon v-if="shouldRenderButtonClose" :class="$style.playerClose" :path="mdiClose" @click="onClickClose" />
      <div :class="$style.title">
        {{ theTrack.name }}
      </div>
      <audio ref="refAudio" :src="theTrack.src" autoplay @ended="onEnded" />
      <div :class="$style.timeline">
        <div>
          {{ formattedCurrentTime }}
        </div>
        <PlayerSlider v-model="currentTime" :multiplicator="duration" is-lazy />
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
          <PlayerSlider v-model="volume" />
        </div>
      </div>
    </div>
  </BaseSwipable>
</template>

<script lang="ts" setup>
import { useMediaControls } from '@vueuse/core';
import { mdiClose, mdiLinkVariant, mdiPause, mdiPlay, mdiSkipBackward, mdiSkipForward } from '@mdi/js';
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';

import { usePlayerStore } from '@/stores/player';
import { formatDuration, addId } from '@/utils';
import { useToastsStore } from '@/stores/toasts';
import BaseButton from '@/components/BaseButton.vue';
import BaseIcon from '@/components/BaseIcon.vue';
import PlayerSlider from '@/components/ThePlayer/components/PlayerSlider.vue';
import BaseSwipable from '@/components/BaseSwipable.vue';

const playerStore = usePlayerStore();
const { theTrack } = storeToRefs(playerStore);

const toastsStore = useToastsStore();

const refAudio = ref<HTMLAudioElement>();

const { playing: isPlaying, waiting: isWaiting, currentTime, duration, volume } = useMediaControls(refAudio);

const shouldRenderButtonClose = computed(() => !(isPlaying.value || isWaiting.value));

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

const formatedDuration = computed(() => formatDuration(duration.value * 1000));
const formattedCurrentTime = computed(() => formatDuration(currentTime.value * 1000));

const onClickPlayPause = () => {
  isPlaying.value = !isPlaying.value;
};

const onCopyLinkClick = async () => {
  if (!theTrack.value) {
    return;
  }

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

const onSwiped = playerStore.unloadTrack;
</script>

<style lang="scss" module>
.player {
  background-color: var(--color-bg);
  z-index: var(--z-index-the-player);
  box-shadow: 0px -2px 4px 0px rgba(34, 60, 80, 0.2);
  padding: 0.5rem 0;
  width: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  justify-content: center;
}

.playerClose {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  cursor: pointer;

  @media (hover: none) {
    display: none;
  }
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
  height: 100%;
  width: 85%;
  max-width: 5rem;
  display: flex;
  align-items: center;
}

.controlsButton {
  white-space: nowrap;
  min-width: 1.5rem;

  &_main {
    height: 1.5rem;
    width: 2rem;
  }
}
.timeline {
  height: 1.25rem;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}
</style>

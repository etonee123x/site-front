<template>
  <BaseSwipable :class="$style.player" @swiped="onSwiped">
    <div class="l-container" :class="$style.container">
      <BaseIcon
        v-if="shouldRenderButtonClose"
        :class="$style.playerClose"
        class="text-xl"
        :path="mdiClose"
        @click="onClickClose"
      />
      <div :class="$style.header">
        <LazyBaseAlwaysScrollable v-if="isSupported" title="Copy link" @click="onClickTitle">
          <span :class="$style.title">
            <span>{{ name }}</span>
            <BaseIcon :path="mdiLinkVariant" />
          </span>
        </LazyBaseAlwaysScrollable>
        <span v-else :class="$style.title">{{ name }}</span>
      </div>
      <audio ref="refAudio" :src="src" autoplay @ended="onEnded" />
      <div :class="$style.timeline">
        <span>
          {{ formattedCurrentTime }}
        </span>
        <PlayerSlider v-model="currentTime" :multiplier="duration" is-lazy />
        <span>
          {{ formatedDuration }}
        </span>
      </div>
      <div :class="$style.controls">
        <div :class="$style.controlsLeft">
          <BaseToggler v-model="isShuffleModeEnabled" :class="$style.controlsButton">
            <BaseIcon class="text-2xl" :path="mdiShuffleVariant" />
          </BaseToggler>
        </div>
        <div :class="$style.controlsCenter">
          <BaseButton
            v-for="controlButton in controlButtons"
            :key="controlButton.id"
            :is-disabled="controlButton.isDisabled"
            :class="[$style.controlsButton, $style.controlsButton_main]"
            @click="controlButton.onClick"
          >
            <BaseIcon class="text-2xl" :path="controlButton.icon" />
          </BaseButton>
        </div>
        <div :class="$style.controlsRight">
          <PlayerSlider v-model="volume" />
        </div>
      </div>
    </div>
  </BaseSwipable>
</template>

<i18n lang="yaml">
En:
  copied: 'Copied!'
Ru:
  copied: 'Скопировано!'
</i18n>

<script lang="ts" setup>
import { useClipboard, useMediaControls } from '@vueuse/core';
import {
  mdiClose,
  mdiShuffleVariant,
  mdiLinkVariant,
  mdiPause,
  mdiPlay,
  mdiSkipBackward,
  mdiSkipForward,
} from '@mdi/js';
import { ref, computed, defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { propFn } from '@shared/src/utils';

import { PlayerSlider } from './components';

import { usePlayerStore, useToastsStore } from '@/stores';
import { formatDuration, addId } from '@/utils';
import { BaseButton, BaseIcon, BaseSwipable, BaseToggler } from '@/components/ui';

const LazyBaseAlwaysScrollable = defineAsyncComponent(() =>
  import('@/components/ui').then(propFn('BaseAlwaysScrollabe')),
);

const { t } = useI18n({ useScope: 'local' });

const playerStore = usePlayerStore();
const { name, src, url, isShuffleModeEnabled, isNotEmptyHistory } = storeToRefs(playerStore);

const toastsStore = useToastsStore();

const refAudio = ref<HTMLAudioElement>();

const { playing: isPlaying, waiting: isWaiting, currentTime, duration, volume } = useMediaControls(refAudio);

const shouldRenderButtonClose = computed(() => !(isPlaying.value || isWaiting.value));

const controlButtons = computed(() =>
  [
    {
      icon: mdiSkipBackward,
      onClick: playerStore.loadPrev,
      isDisabled: isShuffleModeEnabled.value && !isNotEmptyHistory.value,
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

const onEnded = playerStore.loadNext;

const onClickClose = playerStore.unloadTrack;

const onSwiped = playerStore.unloadTrack;

const urlFull = computed(() => {
  let _url = [window.location.origin, url.value].join('');

  try {
    _url = encodeURI(_url);
  } catch (e) {
    console.error(e);
  }

  return _url;
});

const { copy, isSupported } = useClipboard({ source: urlFull, legacy: true });

const onClickTitle = () => copy().then(() => toastsStore.toastSuccess(t('copied')));
</script>

<style lang="scss" module>
.player {
  background-color: var(--color-bg);
  z-index: var(--z-index-the-player);
  box-shadow: 0px -2px 4px 0px rgba(34, 60, 80, 0.2);
  padding: 0.5rem 0;
  width: 100%;
  position: relative;
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

.header {
  text-align: center;
}

.title {
  cursor: pointer;
  border-bottom: 1px var(--color-dark) dashed;
  display: inline-flex;
  align-items: flex-start;
  gap: 0.25rem;
  max-width: 100%;
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

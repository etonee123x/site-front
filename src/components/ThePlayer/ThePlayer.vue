<template>
  <BaseSwipable
    class="bg-background z-1000 shadow-[0_-2px_4px_0_rgba(34,60,80,0.2)] py-2 relative w-full"
    @swiped="onSwiped"
  >
    <div class="layout-container mx-auto flex flex-col gap-1 justify-center">
      <BaseButton
        v-if="shouldRenderButtonClose"
        class="text-xl absolute end-2 top-2 no-hover:hidden"
        @click="onClickClose"
      >
        <BaseIcon :path="mdiClose" />
      </BaseButton>
      <BaseAlwaysScrollable class="[--base-always-scrollable--content--margin:0_auto]">
        <div
          class="pointer flex items-start gap-0.5 border-b border-b-dark border-dashed"
          title="Copy link"
          @click="onClickTitle"
        >
          <span>{{ playerStore.name }}</span>
          <BaseIcon :path="mdiLinkVariant" />
        </div>
      </BaseAlwaysScrollable>
      <audio :src="playerStore.src" autoplay ref="audio" @ended="onEnded" />
      <div class="h-5 w-full mx-auto flex justify-between items-center gap-2">
        <span>
          {{ formattedCurrentTime }}
        </span>
        <PlayerSlider
          :multiplier="duration"
          isLazy
          v-model="currentTime"
          @keydown.right="onKeyDownRightTime"
          @keydown.left="onKeyDownLeftTime"
        />
        <span>
          {{ formatedDuration }}
        </span>
      </div>
      <div class="grid grid-cols-[1fr_min-content_1fr] grid-areas-['left_center_right'] gap-x-4 items-center">
        <div class="flex justify-end">
          <BaseToggler class="whitespace-nowrap min-w-6" v-model="playerStore.isShuffleModeEnabled">
            <BaseIcon class="text-2xl" :path="mdiShuffleVariant" />
          </BaseToggler>
        </div>
        <div class="flex justify-center gap-2">
          <BaseButton
            v-for="controlButton in controlButtons"
            :isDisabled="controlButton.isDisabled"
            class="whitespace-nowrap min-w-6 h-6 w-8"
            :key="controlButton.id"
            @click="controlButton.onClick"
          >
            <BaseIcon class="text-2xl" :path="controlButton.icon" />
          </BaseButton>
        </div>
        <div class="flex h-full w-5/6 max-w-20 items-center">
          <PlayerSlider v-model="volume" @keydown.right="onKeyDownRightVolume" @keydown.left="onKeyDownLeftVolume" />
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
import { computed, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

import PlayerSlider from './components/PlayerSlider.vue';

import BaseButton from '@/components/ui/BaseButton';
import BaseIcon from '@/components/ui/BaseIcon';
import BaseSwipable from '@/components/ui/BaseSwipable.vue';
import BaseToggler from '@/components/ui/BaseToggler.vue';
import { usePlayerStore } from '@/stores/player';
import { useToastsStore } from '@/stores/toasts';
import { formatDuration } from '@/utils/formatDuration';
import { to0To1Borders } from '@/utils/to0To1Borders';
import BaseAlwaysScrollable from '@/components/ui/BaseAlwaysScrollable.vue';

const { t } = useI18n({ useScope: 'local' });

const playerStore = usePlayerStore();

const toastsStore = useToastsStore();

const audio = useTemplateRef('audio');

const { playing: isPlaying, waiting: isWaiting, currentTime, duration, volume } = useMediaControls(audio);

const shouldRenderButtonClose = computed(() => !(isPlaying.value || isWaiting.value));

const controlButtons = computed(() => [
  {
    id: 0,
    icon: mdiSkipBackward,
    onClick: playerStore.loadPrev,
    isDisabled: playerStore.isShuffleModeEnabled && !playerStore.isNotEmptyHistory,
  },
  {
    id: 1,
    icon: isPlaying.value ? mdiPause : mdiPlay,
    onClick: onClickPlayPause,
  },
  {
    id: 2,
    icon: mdiSkipForward,
    onClick: playerStore.loadNext,
  },
]);

const formatedDuration = computed(() => formatDuration(duration.value * 1000));
const formattedCurrentTime = computed(() => formatDuration(currentTime.value * 1000));

const onClickPlayPause = () => {
  isPlaying.value = !isPlaying.value;
};

const onEnded = playerStore.loadNext;

const onClickClose = playerStore.unloadTrack;

const onSwiped = playerStore.unloadTrack;

const urlFull = computed(() => {
  let _url = [globalThis.location.origin, playerStore.url].join('');

  try {
    _url = encodeURI(_url);
  } catch (e) {
    console.error(e);
  }

  return _url;
});

const { copy } = useClipboard({ source: urlFull, legacy: true });

const onClickTitle = () => copy().then(() => toastsStore.toastSuccess(t('copied')));

const onKeyDownRightTime = () => {
  currentTime.value += 5;
};

const onKeyDownLeftTime = () => {
  currentTime.value -= 5;
};

const onKeyDownRightVolume = () => {
  volume.value = to0To1Borders(volume.value + 0.05);
};

const onKeyDownLeftVolume = () => {
  volume.value = to0To1Borders(volume.value - 0.05);
};
</script>

<template>
  <BaseSwipable
    class="bg-background z-[1000] shadow-[0_-2px_4px_0_rgba(34,60,80,0.2)] py-2 relative w-full"
    @swiped="onSwiped"
  >
    <div class="l-container flex flex-col gap-1 justify-center">
      <BaseIcon
        v-if="shouldRenderButtonClose"
        class="text-xl absolute end-2 top-2 no-hover:hidden"
        :path="mdiClose"
        @click="onClickClose"
      />
      <BaseAlwaysScrollable class="[--base-always-scrollable--content--margin:0_auto]">
        <div
          class="pointer flex items-start gap-0.5 border-b border-b-dark border-dashed"
          title="Copy link"
          @click="onClickTitle"
        >
          <span>{{ name }}</span>
          <BaseIcon :path="mdiLinkVariant" />
        </div>
      </BaseAlwaysScrollable>
      <audio ref="refAudio" :src="src" autoplay @ended="onEnded" />
      <div class="h-5 w-full mx-auto flex justify-between items-center gap-2">
        <span>
          {{ formattedCurrentTime }}
        </span>
        <PlayerSlider
          v-model="currentTime"
          :multiplier="duration"
          is-lazy
          @keydown.right="onKeyDownRightTime"
          @keydown.left="onKeyDownLeftTime"
        />
        <span>
          {{ formatedDuration }}
        </span>
      </div>
      <div class="grid grid-cols-[1fr_min-content_1fr] grid-areas-['left_center_right'] gap-x-4 items-center">
        <div class="flex justify-end">
          <BaseToggler v-model="isShuffleModeEnabled" class="whitespace-nowrap min-w-6">
            <BaseIcon class="text-2xl" :path="mdiShuffleVariant" />
          </BaseToggler>
        </div>
        <div class="flex justify-center gap-2">
          <BaseButton
            v-for="controlButton in controlButtons"
            :key="controlButton.id"
            :is-disabled="controlButton.isDisabled"
            class="whitespace-nowrap min-w-6 h-6 w-8"
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
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import PlayerSlider from './components/PlayerSlider.vue';

import BaseButton from '@/components/ui/BaseButton.vue';
import BaseIcon from '@/components/ui/BaseIcon.vue';
import BaseSwipable from '@/components/ui/BaseSwipable.vue';
import BaseToggler from '@/components/ui/BaseToggler.vue';
import { usePlayerStore } from '@/stores/player';
import { useToastsStore } from '@/stores/toasts';
import { formatDuration } from '@/utils/formatDuration';
import { addId } from '@/utils/addId';
import { to0To1Borders } from '@/utils/to0To1Borders';
import BaseAlwaysScrollable from '@/components/ui/BaseAlwaysScrollable.vue';

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

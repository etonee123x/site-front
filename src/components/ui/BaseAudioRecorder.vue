<template>
  <button
    type="button"
    :class="INPUT.default"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
    @keydown.space="onKeyDown"
  >
    <BaseIcon :path="mdiMicrophone" />
  </button>
</template>

<script setup lang="ts">
import BaseIcon from '@/components/ui/BaseIcon';
import { useAudioRecorder } from '@/composables/useAudioRecorder';
import { INPUT } from '@/helpers/ui';
import { mdiMicrophone } from '@mdi/js';
import { useEventListener } from '@vueuse/core';

const emit = defineEmits<{
  'update:model-value': [Blob];
}>();

const { startRecording, stopRecording, initStream, isRecording } = useAudioRecorder({
  onEnd: (blob) => emit('update:model-value', blob),
});

useEventListener(['mouseup', 'touchend', 'keyup'], (e) => {
  if (!isRecording.value || ('code' in e && e.code !== 'Space')) {
    return;
  }

  stopRecording();
});

const onMouseDown = startRecording;
const onTouchStart = startRecording;
const onKeyDown: HTMLButtonElement['onkeydown'] = (e) => {
  if (e.repeat) {
    return;
  }

  startRecording();
};

initStream();
</script>

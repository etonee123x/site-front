import { ref } from 'vue';
import { useToggle } from '@vueuse/core';

export const useAudioRecorder = (options: Partial<{ onEnd: (blob: Blob) => void | Promise<void> }> = {}) => {
  const [isRecording, toggleIsRecording] = useToggle();
  const mediaRecorder = ref<MediaRecorder | null>(null);
  const audioChunks: Array<Blob> = [];

  const startRecording = () => {
    if (!mediaRecorder.value) {
      return;
    }

    audioChunks.length = 0;
    mediaRecorder.value.start();
    toggleIsRecording(true);
  };

  const stopRecording = () => {
    if (!mediaRecorder.value) {
      return;
    }

    mediaRecorder.value.stop();
    toggleIsRecording(false);
  };

  const initStream = async () =>
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder.value = new MediaRecorder(stream);

        mediaRecorder.value.ondataavailable = (event) => {
          if (event.data.size === 0) {
            return;
          }
          audioChunks.push(event.data);
        };

        mediaRecorder.value.onstop = () => options.onEnd?.(new Blob(audioChunks, { type: 'audio/ogg' }));
      })
      .catch(console.error);

  return {
    isRecording,
    initStream,
    startRecording,
    stopRecording,
  };
};

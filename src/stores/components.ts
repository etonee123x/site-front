import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useElementSize } from '@vueuse/core';

import ThePlayer from '@/components/ThePlayer.vue';

export const useComponentsStore = defineStore('components', () => {
  const thePlayer = ref<InstanceType<typeof ThePlayer> | null>(null);

  const { height: playerHeight } = useElementSize(thePlayer, undefined, { box: 'border-box' });

  return {
    thePlayer,
    playerHeight,
  };
});

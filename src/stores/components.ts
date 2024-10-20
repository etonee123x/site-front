import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useElementSize } from '@vueuse/core';

import type ThePlayer from '@/components/ThePlayer';

export const useComponentsStore = defineStore('components', () => {
  const thePlayer = ref<InstanceType<typeof ThePlayer> | null>(null);

  const main = ref<HTMLElement | null>(null);

  const { height: playerHeight } = useElementSize(thePlayer, undefined, { box: 'border-box' });

  return {
    thePlayer,
    main,
    playerHeight,
  };
});

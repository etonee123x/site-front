import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useElementSize } from '@vueuse/core';

import type { Unpromise } from '@/types';

const _importPlayer = () => import('@/components/ThePlayer');

export const useComponentsStore = defineStore('components', () => {
  const thePlayer = ref<InstanceType<Unpromise<ReturnType<typeof _importPlayer>>['default']> | null>(null);

  const main = ref<HTMLElement | null>(null);

  const { height: playerHeight } = useElementSize(thePlayer, undefined, { box: 'border-box' });

  return {
    thePlayer,
    main,
    playerHeight,
  };
});

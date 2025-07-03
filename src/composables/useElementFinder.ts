import { shallowRef } from 'vue';
import { useMutationObserver, useDebounceFn } from '@vueuse/core';
import { isServer } from '@/constants/target';

export const useElementFinder = (getElement: () => HTMLElement | null) => {
  const element = shallowRef<HTMLElement | null>(null);

  if (isServer) {
    return element;
  }

  const update = useDebounceFn(() => {
    element.value = getElement();
  }, 100);

  useMutationObserver(document.body, update, { childList: true, subtree: true });

  update();

  return element;
};

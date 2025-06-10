import { shallowRef } from 'vue';
import { useMutationObserver, useDebounceFn } from '@vueuse/core';

export const useElementFinder = (getElement: () => HTMLElement | null) => {
  const element = shallowRef<HTMLElement | null>(null);

  const update = useDebounceFn(() => {
    element.value = getElement();
  }, 100);

  useMutationObserver(document.body, update, { childList: true, subtree: true });

  update();

  return element;
};

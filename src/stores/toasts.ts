import { computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import { isNotEmptyArray } from '@types';

import { type Toast, TOAST_TYPE } from '@/types';

interface Options {
  ttl?: number;
  type: Toast['type'];
}

const DEFAULT_OPTIONS = Object.freeze({
  ttl: 5000,
});

export const useToastsStore = defineStore('toasts', () => {
  const toasts = reactive<Array<Toast>>([]);

  const toast = (text: string, { ttl = DEFAULT_OPTIONS.ttl, ...options }: Options) => {
    const id = Date.now();

    toasts.push({ text, id, ...options });

    setTimeout(() => closeToast(id), ttl);
  };

  const hasToasts = computed(() => isNotEmptyArray(toasts));

  const toastSuccess = (text: string, options?: Options) => toast(text, { type: TOAST_TYPE.SUCCESS, ...options });

  const toastError = (text: string, options?: Options) => toast(text, { type: TOAST_TYPE.ERROR, ...options });

  const closeToast = (id: number) => {
    const index = toasts.findIndex(({ id: _id }) => _id === id);
    if (index === -1) {
      return;
    }

    toasts.splice(index, 1);
  };

  return {
    toasts,
    hasToasts,

    toastSuccess,
    toastError,
    closeToast,
  };
});

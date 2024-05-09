import { computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import { isNotEmptyArray } from '@shared/src/utils';
import { toId, type Id } from '@shared/src/types';

import { type Toast, ToastType } from '@/types';

interface Options {
  ttl?: number;
  type: Toast['type'];
}

const DEFAULT_OPTIONS = Object.freeze({
  ttl: 5000 * 1000,
});

export const useToastsStore = defineStore('toasts', () => {
  const toasts = reactive<Array<Toast>>([]);

  const toast = (text: string, { ttl = DEFAULT_OPTIONS.ttl, ...options }: Options) => {
    const id = toId(Date.now());

    toasts.push({ text, id, ...options });

    setTimeout(() => closeToast(id), ttl);
  };

  const hasToasts = computed(() => isNotEmptyArray(toasts));

  const toastSuccess = (text: string, options?: Options) => toast(text, { type: ToastType.Success, ...options });

  const toastError = (text: string, options?: Options) => toast(text, { type: ToastType.Error, ...options });

  const closeToast = (id: Id) => {
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

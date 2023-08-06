import { WithId } from '@/types';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export enum TOAST_TYPE {
  ERROR = 'error',
  SUCCESS = 'success',
}

type Toast = WithId<{ text: string; type: TOAST_TYPE }>

interface ToastOptions { ttl: number }

const DEFAULT_TOAST_OPTIONS: ToastOptions = {
  ttl: 5000,
};

export const useToastsStore = defineStore('toasts', () => {
  const toasts = reactive<Array<Toast>>([]);

  const toast = ({ text, ttl, type }: { text: string; ttl: number; type: TOAST_TYPE }) => {
    const id = Date.now();
    toasts.push({ text, type, id });
    setTimeout(() => closeToast(id), ttl);
  };

  const toastSuccess = (text: string, { ttl }: ToastOptions = DEFAULT_TOAST_OPTIONS) =>
    toast({ text, type: TOAST_TYPE.SUCCESS, ttl });

  const toastError = (text: string, { ttl }: ToastOptions = DEFAULT_TOAST_OPTIONS) =>
    toast({ text, type: TOAST_TYPE.ERROR, ttl });

  const closeToast = (id: number) => {
    const index = toasts.findIndex(toast => toast.id === id);
    if (index === -1) {
      return;
    }

    toasts.splice(index, 1);
  };

  return {
    toasts,

    toastSuccess,
    toastError,
    closeToast,
  };
});

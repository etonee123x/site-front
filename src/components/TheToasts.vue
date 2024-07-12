<template>
  <ul :style="style" class="flex flex-col gap-2 fixed left-1/2 -translate-x-1/2">
    <li
      v-for="toast in toasts.slice(0, 5)"
      :key="toast.id"
      class="select-none p-2 mx-auto w-fit min-w-[min(20rem,80vw)] bg-background border border-dark rounded-sm with-hover:scale-[1.02]"
      :class="isSuccess(toast) ? 'text-success' : 'text-error'"
    >
      <span class="text-lg relative flex items-center justify-center gap-2">
        <BaseIcon :path="getIconPath(toast)" />
        <span class="text-[initial]">{{ toast.text }}</span>
        <BaseIcon
          :path="mdiClose"
          class="cursor-pointer items-center justify-center absolute end-0 text-[initial]"
          @click="() => onClickClose(toast)"
        />
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { mdiCheck, mdiClose } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { useToastsStore } from '@/stores/toasts';
import { useComponentsStore } from '@/stores/components';
import { ToastType, type Toast } from '@/types';
import BaseIcon from '@/components/ui/BaseIcon.vue';

const toastsStore = useToastsStore();
const { toasts } = storeToRefs(toastsStore);

const componentsStore = useComponentsStore();
const { playerHeight } = storeToRefs(componentsStore);

const isSuccess = (toast: Toast) => toast.type === ToastType.Success;

const getIconPath = (toast: Toast) => (isSuccess(toast) ? mdiCheck : mdiClose);

const onClickClose = (toast: Toast) => toastsStore.closeToast(toast.id);

const style = computed(() => ({ bottom: `calc(1rem + ${playerHeight.value}px)` }));
</script>

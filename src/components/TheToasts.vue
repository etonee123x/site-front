<template>
  <ul :style class="flex flex-col gap-2 fixed left-1/2 -translate-x-1/2">
    <li
      v-for="toast in toastsStore.toasts.slice(0, 5)"
      class="select-none p-2 mx-auto w-fit min-w-[min(20rem,80vw)] bg-background border border-dark rounded-sm with-hover:scale-[1.02]"
      :class="isSuccess(toast) ? 'text-success' : 'text-error'"
      :key="toast.id"
    >
      <span class="text-lg relative flex items-center justify-center gap-2">
        <BaseIcon :path="getIconPath(toast)" />
        <span class="text-[initial]">{{ toast.text }}</span>
        <BaseButton @click="() => onClickClose(toast)">
          <BaseIcon :path="mdiClose" class="cursor-pointer items-center justify-center absolute end-0 text-[initial]" />
        </BaseButton>
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { mdiCheck, mdiClose } from '@mdi/js';
import { computed } from 'vue';

import { ToastType, useToastsStore, type Toast } from '@/stores/toasts';
import { useComponentsStore } from '@/stores/components';
import BaseIcon from '@/components/ui/BaseIcon';
import BaseButton from '@/components/ui/BaseButton';

const toastsStore = useToastsStore();

const componentsStore = useComponentsStore();

const isSuccess = (toast: Toast) => toast.type === ToastType.Success;

const getIconPath = (toast: Toast) => (isSuccess(toast) ? mdiCheck : mdiClose);

const onClickClose = (toast: Toast) => toastsStore.closeToast(toast.id);

const style = computed(() => ({ bottom: `calc(1rem + ${componentsStore.playerHeight}px)` }));
</script>

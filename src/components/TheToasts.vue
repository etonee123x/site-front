<template>
  <ul :style="style" :class="$style.toasts">
    <li v-for="toast in toasts.slice(0, 5)" :key="toast.id" :class="getClassesToast(toast)">
      <span class="text-lg" :class="$style.toastInner">
        <BaseIcon :path="getIconPath(toast)" :class="$style.toastIcon" />
        <span>{{ toast.text }}</span>
        <BaseIcon :path="mdiClose" :class="$style.toastClose" @click="() => onClickClose(toast)" />
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { mdiCheck, mdiClose } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { useCssModule, computed } from 'vue';
import { stringToLowerCase } from '@shared/src/utils';

import { useToastsStore } from '@/stores/toasts';
import { useComponentsStore } from '@/stores/components';
import { ToastType, type Toast } from '@/types';
import BaseIcon from '@/components/ui/BaseIcon.vue';

const toastsStore = useToastsStore();
const { toasts } = storeToRefs(toastsStore);

const componentsStore = useComponentsStore();
const { playerHeight } = storeToRefs(componentsStore);

const $style = useCssModule();

const getClassesToast = (toast: Toast) => [$style.toast, $style[`toast_${stringToLowerCase(toast.type)}`]];

const getIconPath = (toast: Toast) => (toast.type === ToastType.Success ? mdiCheck : mdiClose);

const onClickClose = (toast: Toast) => toastsStore.closeToast(toast.id);

const style = computed(() => ({ bottom: `calc(1rem + ${playerHeight.value}px)` }));
</script>

<style lang="scss" module>
.toasts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);

  &__toast-close {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
  }
}

.toast {
  user-select: none;
  padding: 0.5rem;
  margin: 0 auto;
  width: fit-content;
  min-width: min(20rem, 80vw);
  background-color: var(--color-bg);
  border: 1px solid var(--color-dark);
  border-radius: 0.125rem;

  @include withHover {
    transform: scale(1.02);
  }

  &_error {
    .toastIcon {
      color: var(--color-error);
    }
  }

  &_success {
    .toastIcon {
      color: var(--color-success);
    }
  }
}

.toastInner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.toastClose {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
}
</style>

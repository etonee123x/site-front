<template>
  <ul class="toasts">
    <li
      v-for="toast in toasts.slice(0, 5)"
      :key="toast.id"
      :class="[
        'toasts__toast',
        `toasts__toast_${toast.type}`
      ]"
    >
      <span class="toasts__toast-inner">
        <BaseIcon :path="toast.type === TOAST_TYPE.SUCCESS ? mdiCheck : mdiClose" class="toasts__tost-icon" />
        <span class="toasts__toast-test">{{ toast.text }}</span>
        <span class="toasts__toast-close" @click="() => closeToast(toast.id)">
          <BaseIcon size="20" :path="mdiClose" />
        </span>
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { mdiCheck, mdiClose } from '@mdi/js';
import { storeToRefs } from 'pinia';

import { useToastsStore, TOAST_TYPE } from '@/stores/toasts';

import BaseIcon from '@/components/BaseIcon.vue';

const toastsStore = useToastsStore();
const { closeToast } = toastsStore;
const { toasts } = storeToRefs(toastsStore);
</script>

<style lang="scss" scoped>
.toasts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: fixed;
  bottom: calc(1rem + var(--size-player-height, 0px));
  left: 50%;
  transform: translateX(-50%);

  &__toast {
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
      .toasts__tost-icon {
        color: var(--color-error)
      }
    }

    &_success {
      .toasts__tost-icon {
        color: var(--color-success)
      }
    }
  }

  &__toast-inner {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  &__toast-close {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
  }
}
</style>

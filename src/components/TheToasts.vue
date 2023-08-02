<template>
  <div class="toasts">
    <div
      v-for="toast in toasts.slice(0, 5)"
      :key="toast.id"
      class="toasts__toast toast"
    >
      <div class="toast__type">
        {{ toast.type === TOAST_TYPE.SUCCESS ? '✅' : '❌' }}
      </div>
      <div
        class="toast__close"
        @click="() => closeToast(toast.id)"
      >
        X
      </div>
      {{ toast.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToastsStore, TOAST_TYPE } from '@/stores/toasts';
import { storeToRefs } from 'pinia';

const toastsStore = useToastsStore();
const { closeToast } = toastsStore;
const { toasts } = storeToRefs(toastsStore);
</script>

<style lang="scss" scoped>
.toasts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toast {
  user-select: none;
  padding: 0.5rem;
  text-align: center;
  margin: 0 auto;
  width: fit-content;
  min-width: min(20rem, 80vw);
  background-color: var(--color-bg);
  position: relative;
  box-shadow: 0px 0px 0px 1px var(--color-dark);
  border-radius: 0.125rem;
  .hoverable &:hover {
    transform: scale(1.02);
  }
  &__close {
    cursor: pointer;
    position: absolute;
    right: 0.5rem;
  }
  &__type {
    position: absolute;
    left: 0.5rem;
  }
}
</style>

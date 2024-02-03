<template>
  <dialog ref="refDialog" :style="style" :class="$style.dialog">
    <div ref="refDialogInner" :class="$style.inner">
      <div :class="$style.header">
        <span :class="[$style.title, 'f-h2']">{{ title }}</span>
        <span :class="$style.closeIcon" @click="onClickCloseIcon">
          <BaseIcon size="20" :path="mdiClose" />
        </span>
      </div>
      <div :class="$style.main">
        <slot v-bind="{ close }" />
      </div>
      <div :class="$style.footer">
        <BaseButton @click="onClickButtonCancel">
          {{ buttonTextCancel }}
        </BaseButton>
        <BaseButton @click="onClickButtonConfirm">
          {{ buttonTextConfirm }}
        </BaseButton>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { mdiClose } from '@mdi/js';

import BaseIcon from '@/components/BaseIcon.vue';
import BaseButton from './BaseButton.vue';

const refDialog = ref<HTMLDialogElement>();
const refDialogInner = ref<HTMLDivElement>();

const props = withDefaults(
  defineProps<{
    title?: string;
    width?: string;
    height?: string;
    buttonTextConfirm?: string;
    buttonTextCancel?: string;
  }>(),
  {
    title: undefined,
    width: 'auto',
    height: 'auto',
    buttonTextConfirm: 'Confirm',
    buttonTextCancel: 'Cancel',
  },
);

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const style = computed(() => ({
  width: props.width,
  height: props.height,
}));

const close = () => {
  refDialog.value?.close();
  emit('close');
};

onClickOutside(refDialogInner, close);

const onClickCloseIcon = close;

const onClickButtonCancel = close;

const onClickButtonConfirm = () => {
  emit('confirm');
  close();
};

defineExpose({ refDialog });
</script>

<style lang="scss" module>
.dialog {
  padding: 0;
  border: 1px var(--color-details) solid;
  outline: none;
  border-radius: 0.5rem;
  background-color: var(--color-bg);

  &::backdrop {
    background: rgba(0, 0, 0, 50%);
  }
}

.inner {
  padding: 1rem;
  display: flex;
  gap: 1.5rem;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.closeIcon {
  cursor: pointer;
}
</style>

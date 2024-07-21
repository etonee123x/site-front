<template>
  <Tippy
    ref="refTippy"
    :append-to="appendTo"
    :interactive="isInteractive"
    :trigger="trigger"
    placement="bottom"
    inline-positioning
    max-width="none"
    :z-index="0"
  >
    <slot />
    <template #content>
      <slot name="content" />
    </template>
  </Tippy>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Tippy, type TippyComponent } from 'vue-tippy';

const props = withDefaults(
  defineProps<
    Partial<{
      isInteractive: boolean;
      triggers: Array<'focus' | 'mouseenter' | 'click' | 'manual'>;
    }>
  >(),
  {
    isInteractive: true,
  },
);

const refTippy = ref<TippyComponent>();

const trigger = computed(() => props.triggers?.join(' ') || undefined);

const show = () => refTippy.value?.show();

const hide = () => refTippy.value?.hide();

const appendTo = () => window.document.body;

defineExpose({
  show,
  hide,
});
</script>

<style>
.tippy-content {
  --popover-content--max-width: 20rem;
  --popover-content--max-height: 25rem;
  @apply bg-background border border-dark rounded p-2 max-w-[--popover-content--max-width] max-h-[--popover-content--max-height] overflow-x-hidden overflow-y-auto;
}
</style>

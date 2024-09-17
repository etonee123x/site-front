<template>
  <Tippy ref="refTippy" v-bind="{ ...PROPS_TIPPY_DEFAULTS, ...propsTippy }" :trigger="trigger">
    <slot />
    <template #content>
      <slot name="content" />
    </template>
  </Tippy>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Tippy, type TippyComponent } from 'vue-tippy';

const props = defineProps<
  Partial<{
    propsTippy: TippyComponent['$props'];
    triggers: Array<'focus' | 'mouseenter' | 'click' | 'manual'>;
  }>
>();

const PROPS_TIPPY_DEFAULTS = Object.freeze({
  appendTo: () => document.body,
  interactive: true,
  maxWidth: 'none',
  duration: 0,
});

const refTippy = ref<TippyComponent>();

const trigger = computed(() => props.triggers?.join(' ') || undefined);

const show = () => refTippy.value?.show();

const hide = () => refTippy.value?.hide();

defineExpose({
  show,
  hide,
  refTippy,
});
</script>

<style>
.tippy-content {
  --popover-content--max-width: 20rem;
  --popover-content--max-height: 25rem;
  @apply bg-background border border-dark rounded p-2 w-max max-w-[--popover-content--max-width] max-h-[--popover-content--max-height] overflow-x-hidden overflow-y-auto;
}
</style>

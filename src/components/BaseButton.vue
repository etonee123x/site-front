<template>
  <button :class="[$style.button, isActive && $style.button_active]" :disabled="isDisabled" @click="onCLick">
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<
  Partial<{
    isActive: boolean;
    isDisabled: boolean;
  }>
>();

const emit = defineEmits<{
  click: [];
}>();

const onCLick = () => {
  if (props.isDisabled) {
    return;
  }

  emit('click');
};
</script>

<style lang="scss" module>
.button {
  all: unset;
  background-color: var(--color-items);
  border: 1px solid var(--color-dark);
  border-radius: 0.25rem;
  padding: 0.25rem;
  text-align: center;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;

  @include withHover {
    &:not(&[disabled]) {
      background-color: color-mix(in srgb, var(--color-items) 95%, var(--color-black));
    }
  }

  &:is(&:active, &_active):not(&[disabled]) {
    color: var(--color-details);
    border-color: var(--color-details);
  }

  &[disabled] {
    opacity: 0.5;
    cursor: default;

    background-color: var(--color-dark);
    color: var(--color-items);
  }
}
</style>

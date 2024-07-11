<template>
  <div tabindex="0" :class="$style.directoryElement" @keydown.enter="onClick" @click="onClick">
    <div :class="$style.header">
      <div :class="$style.title">
        {{ element.name }}
      </div>
      <div :class="$style.birthTime" title="Created at">
        {{ birthTimeFormatted }}
      </div>
    </div>
    <div :class="$style.content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import { type ItemFile } from '@shared/src/types';

const props = defineProps<{
  element: ItemFile;
}>();

const emit = defineEmits<{
  click: [];
}>();

const onClick = () => emit('click');

const birthTimeFormatted = computed(() => format(new Date(props.element.birthtime), 'dd/MM/yyyy, HH:mm'));
</script>

<style lang="scss" module>
.directoryElement {
  background-color: var(--color-items);
  border: 2px var(--color-dark) solid;
  border-radius: 0.5rem;
  width: 100%;
  cursor: pointer;

  @include withHover {
    @apply bg-items-hovered border-details-500;
  }

  &:focus-visible {
    @include onFocus();
    text-decoration: none;
  }
}

.title {
  max-width: 70%;
  overflow-x: auto;
  overflow-y: hidden;
  margin: 0.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(34, 60, 80, 0.4);
}

.content {
  margin: 0.5rem;
}

.birthTime {
  text-align: right;
  margin: 0.5rem;
}
</style>

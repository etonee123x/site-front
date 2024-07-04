<template>
  <DefineTemplate>
    <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24">
      <path :d="path" fill="currentColor" />
    </svg>
  </DefineTemplate>

  <ReuseTemplate v-if="isNil(onClick)" v-bind="$attrs" @click="() => onClick?.()" />
  <BaseButton v-else v-bind="$attrs" class="p-0.5" @click="() => onClick?.()">
    <ReuseTemplate />
  </BaseButton>
</template>

<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core';
import type { FunctionCallback } from '@shared/src/types';
import { isNil } from '@shared/src/utils';
import { type CSSProperties } from 'vue';

import BaseButton from './BaseButton.vue';

withDefaults(
  defineProps<
    {
      path: string;
    } & Partial<{
      size?: CSSProperties['width'];
      onClick: FunctionCallback;
    }>
  >(),
  {
    size: '1em',
  },
);

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();
</script>

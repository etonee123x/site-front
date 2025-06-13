<template>
  <div class="flex flex-col" :class="hasError ? 'group has-error text-error' : 'text-details-800'">
    <label v-if="label" :class="ELEMENT_TITLE" :for="labelFor" class="mb-1">{{ label }}</label>
    <slot />
    <div class="flex mt-1 h-3 gap-2 items-center text-3xs text-black group-[.has-error]:text-error">
      <slot name="bottom">
        {{ maybeMessage }}
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isNotNil } from '@etonee123x/shared/utils/isNotNil';
import { ELEMENT_TITLE } from '@/helpers/ui';

const props = defineProps<
  Partial<{
    labelFor: HTMLLabelElement['htmlFor'];
    errorMessage: string;
    message: string;
    label: string;
  }>
>();

const hasError = computed(() => isNotNil(props.errorMessage));

const maybeMessage = computed(() => props.errorMessage ?? props.message);
</script>

<template>
  <TextInputWrapper :label :labelFor="id" :errorMessage :message>
    <!-- modelModifiers потому что https://github.com/vuejs/core/commit/128ec460ec00ca8672352d019b264c80dfd0c3b0#diff-632fe25b1d749e8f7c45a534f0c822a489496dc43efa2d9bd2c99bb3d3af9eaaR269 -->
    <TextInputBase :id :disabled="isDisabled" :readonly :modelModifiers v-model="model">
      <slot name="end" />
    </TextInputBase>

    <template #bottom>
      <slot name="bottom" />
    </template>
  </TextInputWrapper>
</template>

<script setup lang="ts">
import TextInputBase from '@/components/ui/_TextInputsElements/_TextInputBase.vue';
import TextInputWrapper from '@/components/ui/_TextInputsElements/_TextInputWrapper.vue';
import { computed, useId } from 'vue';
import type { Props } from './types';

const props = defineProps<Props>();

const [model, modelModifiers] = defineModel<string | null>();

const id = useId();

const isDisabled = computed(() => props.disabled || props.isLoading);
</script>

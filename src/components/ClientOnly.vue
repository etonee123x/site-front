<template>
  <slot v-if="isMounted" />
  <slot v-else name="fallback" />
</template>

<script lang="ts" setup>
import { useMounted } from '@vueuse/core';

const isMounted = useMounted();
</script>

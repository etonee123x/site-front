<template>
  <slot v-if="isMounted" />
</template>

<script lang="ts" setup>
import { useMounted } from '@vueuse/core';

const isMounted = useMounted();
</script>

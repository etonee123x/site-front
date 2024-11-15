<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div :class="$s.html" class="whitespace-break-spaces break-words" ref="root" v-html="html" />
</template>

<script setup lang="ts">
import { isString } from '@shared/src/utils/isString';
import { onMounted, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

defineProps<{
  html: string;
}>();

const root = useTemplateRef('root');

const router = useRouter();

onMounted(() =>
  Array.from(root.value?.getElementsByTagName('a') ?? []).forEach((a) =>
    a.addEventListener('click', (event) => {
      const hasHref = event.target && 'href' in event.target && isString(event.target.href);
      const hasTargetBlank = event.target && 'target' in event.target && event.target.target === '_blank';

      if (!hasHref || hasTargetBlank) {
        return;
      }

      event.preventDefault();

      router.push(String(event.target.href).replace(window.origin, ''));
    }),
  ),
);
</script>

<style module="$s">
.html a {
  @apply underline;
}
</style>

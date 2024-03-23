<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div ref="refRoot" :class="$style.content" v-html="html" />
</template>

<script setup lang="ts">
import { isString } from '@shared/src/utils';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

defineProps<{
  html: string;
}>();

const refRoot = ref<HTMLElement>();

const router = useRouter();

onMounted(() =>
  Array.from(refRoot.value?.getElementsByTagName('a') ?? []).forEach((a) =>
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

<style lang="scss" module>
.content {
  a {
    text-decoration: underline;
  }

  white-space: break-spaces;
  word-wrap: break-word;
}
</style>

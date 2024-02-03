<template>
  <div :class="$style.audioMetadata" :title="metadata.title">
    <img :class="$style.icon" :alt="metadata.title" :src="metadata.iconSrc">
    <div :class="$style.value">
      {{ metadata.value }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  metadata: {
    title: string;
    iconSrc: string;
    value: string;
  };
}>();
</script>

<style lang="scss" module>
.audioMetadata {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon {
  height: 1.5rem;
}

.value {
  text-align: center;
  max-width: 10rem;
}
</style>

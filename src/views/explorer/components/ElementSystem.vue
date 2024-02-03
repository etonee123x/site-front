<template>
  <div :class="$style.directoryElement">
    <div :class="$style.title">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@/views/explorer/assets/styles/directory-element.scss';
</style>

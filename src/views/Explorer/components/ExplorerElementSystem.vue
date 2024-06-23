<template>
  <div tabindex="0" :class="$style.directoryElement">
    <div :class="$style.title">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@/views/Explorer/assets/styles/directory-element.scss';
</style>

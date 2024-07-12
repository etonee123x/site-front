<template>
  <div tabindex="0" :class="$s.explorerElement">
    <div :class="$refs.title">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" module="$s">
@import '../assets/styles/explorerElement.scss';
</style>

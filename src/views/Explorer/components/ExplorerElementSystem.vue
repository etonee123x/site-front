<template>
  <div tabindex="0" :class="$s.explorerElement">
    <div :class="$s.title">
      <slot />
    </div>
  </div>
</template>

<style module="$s">
@import '../assets/styles/explorerElement.css';
</style>

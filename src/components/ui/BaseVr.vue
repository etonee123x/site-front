<template>
  <div :class="$style.vr" />
</template>

<style lang="scss" module>
.vr {
  display: inline-block;
  align-self: stretch;
  width: 1px;
  min-height: 1em;
  background-color: var(--color-dark);
}
</style>

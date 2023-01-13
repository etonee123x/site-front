<template>
  <button class="button">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.button {
  all: unset;
  background-color: $color-items;
  box-shadow: 0px 0px 0px 1px $color-dark;
  border-radius: 0.125rem;
  padding: 0.25rem;
  text-align: center;
  cursor: pointer;
  user-select: none;
  .hoverable &:hover {
    background-color: darken($color-items, 5%);
  }
  &:active {
    background-color: darken($color-items, 5%);
    color: $color-details;
    border-color: $color-details;
  }
}
</style>

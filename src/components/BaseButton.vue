<template>
  <button class="button">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.button {
  all: unset;
  background-color: var(--color-items);
  border: 1px solid var(--color-dark);
  border-radius: 0.25rem;
  padding: 0.25rem;
  text-align: center;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;

  .hoverable &:hover {
    background-color: color-mix(in srgb, var(--color-items) 95%, var(--color-black));
  }

  &:active {
    background-color: color-mix(in srgb, var(--color-items) 95%, var(--color-black));
    color: var(--color-details);
    border-color: var(--color-details);
  }
}
</style>

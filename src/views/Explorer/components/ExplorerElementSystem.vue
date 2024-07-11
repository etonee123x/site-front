<template>
  <div tabindex="0" :class="$style.directoryElement">
    <div :class="$style.title">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" module>
.directoryElement {
  background-color: var(--color-items);
  border: 2px var(--color-dark) solid;
  border-radius: 0.5rem;
  width: 100%;
  cursor: pointer;

  @include withHover {
    @apply bg-items-hovered border-details-500;
  }

  &:focus-visible {
    @include onFocus();
    text-decoration: none;
  }
}

.title {
  max-width: 70%;
  overflow-x: auto;
  overflow-y: hidden;
  margin: 0.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(34, 60, 80, 0.4);
}

.content {
  margin: 0.5rem;
}

.birthTime {
  text-align: right;
  margin: 0.5rem;
}
</style>

<template>
  <div class="player"></div>
</template>

<style lang="scss" scoped>
.player {
  height: 8rem;
  background-color: $color-background;
  z-index: $zindex-bigplayer;
  box-shadow: 0px -2px 4px 0px rgba(34, 60, 80, 0.2);
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  &__track-title {
    text-align: center;
  }
}
</style>

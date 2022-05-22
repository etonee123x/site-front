<template>
  <router-link :to="route">
    <div class="folder-element">
      <slot>{{ folderElement.name }}</slot>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { useExplorerStore } from '@/stores/explorer';
import { computed } from 'vue';

const props = withDefaults(defineProps<{ folderElement?: any; forcedRoute?: string }>(), {
  folderElement: undefined,
  forcedRoute: undefined,
});

const explorerStore = useExplorerStore();

const route = computed(() => props.forcedRoute ?? explorerStore.getFullRoute(props.folderElement.url));
</script>

<style scoped lang="scss">
.folder-element {
  border: 2px black solid;
  border-radius: 0.5rem;
  width: 100%;

  &__header {
    display: flex;
    justify-content: space-between;
    box-shadow: 0px -1px 0px 0px rgba(34, 60, 80, 0.4) inset;
  }

  &__content {
    margin: 0.5rem;
  }

  &__picture-wrapper {
    display: flex;
    justify-content: center;
    max-width: 100%;
  }

  &__picture {
    max-width: 100%;
  }

  &__title {
    max-width: 70%;
    overflow-x: auto;
    overflow-y: hidden;
    margin: 0.5rem;
  }

  &__birth-time {
    text-align: right;
    margin: 0.5rem;
  }

  &:hover {
    border-color: $color-details;
  }

  &_file {
    background-color: $color-items;

    &:hover {
      background-color: darken($color-items, 5%);
    }
  }

  &_folder {
    background-color: $color-folders;

    &:hover {
      background-color: darken($color-folders, 10%);
    }
  }
}

.folder {
  &__title {
    margin: auto 0 auto 0.5rem;
  }
}

.metadata {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  overflow-x: auto;

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__icon {
    height: 1.5rem;
  }

  &__desc {
    text-align: center;
    max-width: 10rem;
  }
}
</style>

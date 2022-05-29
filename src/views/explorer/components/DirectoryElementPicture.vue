<template>
  <router-link :to="element.url">
    <div class="directory-element directory-element_file">
      <div class="directory-element__header">
        <div class="directory-element__title">
          <slot>{{ element.name }}</slot>
        </div>
        <div class="directory-element__birth-time" title="Created at">
          {{ getFormattedBirthTime(element.birthTime) }}
        </div>
      </div>
      <div class="directory-element__content">
        <div class="picture__wrapper">
          <img class="picture__content" alt="Картинка" :src="element.src" />
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { ItemPicture } from '@types';
import { getFormattedBirthTime } from '@/utils';

defineProps<{ element: ItemPicture }>();
</script>

<style scoped lang="scss">
.picture {
  &__wrapper {
    display: flex;
    justify-content: center;
    max-width: 100%;
  }

  &__content {
    max-width: 100%;
  }
}
</style>

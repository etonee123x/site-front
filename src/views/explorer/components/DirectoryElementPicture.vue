<template>
  <div @click="onClick">
    <div class="directory-element directory-element_file">
      <div class="directory-element__header">
        <div class="directory-element__title">
          {{ element.name }}
        </div>
        <div
          class="directory-element__birth-time"
          title="Created at"
        >
          {{ getFormattedBirthTime(element.birthtime) }}
        </div>
      </div>
      <div class="directory-element__content">
        <div class="picture__wrapper">
          <img
            class="picture__content"
            alt="Картинка"
            :src="element.src"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ItemPicture } from '@types';
import { getFormattedBirthTime } from '@/utils';
import { useGalleryStore } from '@/stores/gallery';

const props = defineProps<{ element: ItemPicture }>();

const { loadImage } = useGalleryStore();

const onClick = () => loadImage(props.element);
</script>

<style scoped lang="scss">
@import '../assets/styles/directory-element.scss';
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

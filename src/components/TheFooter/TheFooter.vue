<template>
  <footer class="border-t border-t-dark">
    <div class="l-container py-2 flex gap-2 items-center">
      <a target="_blank" :href="TELEGRAM_LINK">
        <img class="size-6" src="./assets/icons/Logo.svg" />
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
const TELEGRAM_LINK = String(import.meta.env.VITE_TELEGRAM_LINK);
</script>

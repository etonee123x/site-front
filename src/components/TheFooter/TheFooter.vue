<template>
  <footer class="border-t border-t-dark">
    <div class="l-container py-2 flex gap-2 items-center">
      <a target="_blank" :href="telegramLink">
        <img class="w-6 h-6" src="/src/components/TheFooter/assets/icons/Logo.svg" />
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
const telegramLink = String(import.meta.env.VITE_TELEGRAM_LINK);
</script>

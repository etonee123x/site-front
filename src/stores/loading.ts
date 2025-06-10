import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
  const sources = reactive(new Set<Promise<unknown>>());

  const isLoading = computed(() => Boolean(sources.size));

  return {
    sources,
    isLoading,
  };
});

import { useRoute, type RouteLocationNormalized } from 'vue-router';
import { computed } from 'vue';

export const doesQueryParamEqualTrue = (queryParamName: string, route: RouteLocationNormalized = useRoute()) =>
  computed(() => route.query[queryParamName] === 'true');

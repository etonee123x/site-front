import { useRoute, type RouteLocationNormalized } from 'vue-router';
import { isKindaTrue } from '@shared/src/utils';
import { computed } from 'vue';

export const doesQueryParamEqualTrue = (queryParamName: string, route: RouteLocationNormalized = useRoute()) =>
  computed(() => isKindaTrue(route.query[queryParamName]));

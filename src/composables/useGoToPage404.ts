import { isServer } from '@/constants/target';
import { RouteName } from '@/router';
import { useRouter } from 'vue-router';
import { createError } from '@etonee123x/shared/helpers/error';

export const useGoToPage404 = () => {
  const router = useRouter();

  return () => {
    if (isServer) {
      throw createError({ statusCode: 404 });
    }

    return router.push({ name: RouteName.Page404 });
  };
};

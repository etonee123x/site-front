import { RouteName } from '@/router';
import { useRouter } from 'vue-router';

export const goToPage404 = () => {
  const router = useRouter();

  return router.push({ name: RouteName.Page404 });
};

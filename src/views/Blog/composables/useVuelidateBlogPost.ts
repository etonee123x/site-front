import type { Ref } from 'vue';
import type { FunctionCallback, PostData } from '@shared/src/types';

import { required } from '@/utils';
import { useVuelidateWithHandle } from '@/composables';

export const useVuelidateBlogPostData = (callback: FunctionCallback, postData: Ref<PostData>) =>
  useVuelidateWithHandle(
    callback,
    {
      text: {
        required,
      },
    },
    postData,
    {
      $lazy: true,
    },
  );

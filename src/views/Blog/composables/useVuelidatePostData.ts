import { type MaybeRefOrGetter, type Ref, toValue } from 'vue';
import type { Post } from '@etonee123x/shared/types/blog';
import { helpers, requiredIf } from '@vuelidate/validators';

import { i18n } from '@/i18n';
import useVuelidate from '@vuelidate/core';
import type { ForPost } from '@etonee123x/shared/types/database';

const requiredIfNoFiles = (filesUrls: Array<string>, files: MaybeRefOrGetter<Array<File>>) =>
  helpers.withMessage(
    () => i18n.global.t('validations.required'),
    requiredIf(() => toValue(files).length === 0 && toValue(filesUrls).length === 0),
  );

export const useVuelidatePostData = (postData: Ref<ForPost<Post>>, files: MaybeRefOrGetter<Array<File>> = []) => {
  const v$ = useVuelidate(
    {
      text: {
        requiredIfNoFiles: requiredIfNoFiles(postData.value.filesUrls, files),
      },
    },
    postData,
    { $lazy: true },
  );

  return {
    v$,
  };
};
